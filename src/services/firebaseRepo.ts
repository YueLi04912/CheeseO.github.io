import { db, storage } from './firebase'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, getDocs, increment, query, where, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(',')
  const mime = meta.match(/data:(.*?);/)?.[1] || 'application/octet-stream'
  const bin = atob(base64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

async function uploadFile(path: string, file: File | Blob): Promise<string> {
  const r = ref(storage, path)
  await uploadBytes(r, file)
  return getDownloadURL(r)
}

async function deleteStorageFileByUrl(url?: string | null) {
  if (!url || typeof url !== 'string') return
  // Skip inline/base64 data URLs, they are not stored in Firebase Storage
  if (url.startsWith('data:')) return
  try {
    const r = ref(storage, url)
    await deleteObject(r)
  } catch (error) {
    console.error('Failed to delete storage file:', url, error)
  }
}

async function deleteStorageFilesByUrls(urls: Array<string | null | undefined>) {
  const tasks = urls
    .filter((u): u is string => typeof u === 'string' && !!u)
    .map(u => deleteStorageFileByUrl(u))
  if (tasks.length === 0) return
  await Promise.all(tasks)
}

function formatUserDoc(doc: any) {
  const data = doc.data()
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
    lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate().toISOString() : (data.lastLoginAt || undefined)
  }
}

function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

export function generatePasswordSalt(length = 16): string {
  const arr = new Uint8Array(length)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr)
  } else {
    for (let i = 0; i < length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
  }
  return bufferToHex(arr)
}

export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    const encoder = new TextEncoder()
    const data = encoder.encode(salt + password)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return bufferToHex(digest)
  }
  if (typeof btoa !== 'undefined') {
    return btoa(salt + ':' + password)
  }
  return salt + ':' + password
}

export async function createPasswordHash(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || generatePasswordSalt()
  const hash = await hashPasswordWithSalt(password, actualSalt)
  return { hash, salt: actualSalt }
}

export function isSha256Hash(value: string): boolean {
  return /^[0-9a-f]{64}$/i.test(value)
}

export async function verifyPasswordHash(password: string, stored: { password: string; passwordSalt?: string }): Promise<boolean> {
  if (!stored.password || !stored.passwordSalt) return false
  const hash = await hashPasswordWithSalt(password, stored.passwordSalt)
  return hash === stored.password
}

export const firebaseRepo = {
  // ... (existing methods)

  // ==================== Article Related ====================
  async createArticle(articleData: any) {
    // Handle cover image upload from base64
    if (articleData.coverImage && typeof articleData.coverImage === 'string' && articleData.coverImage.startsWith('data:')) {
      const blob = dataUrlToBlob(articleData.coverImage)
      const coverUrl = await uploadFile(`covers/${articleData.authorId}/${Date.now()}.jpg`, blob)
      articleData.coverImage = coverUrl

      // Normalize images array to avoid storing large base64 data
      if (Array.isArray(articleData.images) && articleData.images.length > 0) {
        articleData.images = [coverUrl]
      }
    }

    const payload = {
      ...articleData,
      status: articleData.status || 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, 'articles'), payload)
    return { id: docRef.id, ...payload }
  },

  async saveDraftArticle(articleData: any) {
    return this.createArticle({ ...articleData, status: 'draft' })
  },

  async updateArticle(id: string, updates: any) {
    const docRef = doc(db, 'articles', id)
    
    // Handle cover image update if it's a new base64 string
    if (updates.coverImage && updates.coverImage.startsWith('data:')) {
      const blob = dataUrlToBlob(updates.coverImage)
      updates.coverImage = await uploadFile(`covers/${updates.authorId || 'unknown'}/${Date.now()}.jpg`, blob)
    }

    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return { id, ...updates }
  },

  async deleteArticle(id: string) {
    const docRef = doc(db, 'articles', id)
    try {
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        const data: any = snap.data() || {}
        const urls: Array<string | null | undefined> = []
        if (typeof data.coverImage === 'string') {
          urls.push(data.coverImage)
        }
        if (Array.isArray(data.images)) {
          urls.push(...data.images)
        }
        if (typeof data.videoUrl === 'string') {
          urls.push(data.videoUrl)
        }
        await deleteStorageFilesByUrls(urls)
      }
    } catch (error) {
      console.error('Failed to cleanup storage files for article:', id, error)
    }
    await deleteDoc(docRef)
    return true
  },

  async getArticlesByAuthor(authorId: string) {
    const q = query(collection(db, 'articles'), where('authorId', '==', authorId))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || undefined),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
      };
    })
  },

  async getVideoArticles() {
    const q = query(collection(db, 'articles'), where('isVideo', '==', true), where('status', '==', 'published'))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || undefined),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
      };
    })
  },

  async getPublishedArticles() {
    const q = query(collection(db, 'articles'), where('status', '==', 'published'))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || undefined),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
      };
    })
  },

  async getBlogArticles() {
    // Firestore doesn't support "not equal" or "or" easily in all versions, but we can query for isVideo == false
    // or just fetch all and filter if mixed. 
    // Assuming isVideo is always set to boolean.
    const q = query(collection(db, 'articles'), where('isVideo', '==', false), where('status', '==', 'published'))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || undefined),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
      };
    })
  },

  // ==================== 分类相关 ====================
  async getCategories() {
    const snap = await getDocs(collection(db, 'categories'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async createCategory(category: any) {
    const docRef = await addDoc(collection(db, 'categories'), category)
    return { id: docRef.id, ...category }
  },

  async updateCategory(id: string, updates: any) {
    const docRef = doc(db, 'categories', id)
    await updateDoc(docRef, updates)
    return { id, ...updates }
  },

  async deleteCategory(id: string) {
    const docRef = doc(db, 'categories', id)
    await deleteDoc(docRef)
    return true
  },

  // ==================== Interactions (Like, Bookmark, Follow) ====================
  
  // Check like status
  async isArticleLiked(userId: string, articleId: string) {
    const q = query(
      collection(db, 'likes'), 
      where('userId', '==', userId), 
      where('articleId', '==', articleId)
    )
    const snap = await getDocs(q)
    return !snap.empty
  },

  // Get all article IDs liked by user
  async getUserLikedArticleIds(userId: string) {
    const q = query(collection(db, 'likes'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data().articleId)
  },

  // Get all article IDs bookmarked by user
  async getUserBookmarkedArticleIds(userId: string) {
    const q = query(collection(db, 'bookmarks'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data().articleId)
  },

  // Get all user IDs followed by user
  async getUserFollowingIds(followerId: string) {
    const q = query(collection(db, 'follows'), where('followerId', '==', followerId))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data().followingId)
  },

  // Get all user IDs following the user (Followers)
  async getUserFollowerIds(userId: string) {
    const q = query(collection(db, 'follows'), where('followingId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data().followerId)
  },

  // Toggle like
  async toggleLike(userId: string, articleId: string) {
    const q = query(
      collection(db, 'likes'), 
      where('userId', '==', userId), 
      where('articleId', '==', articleId)
    )
    const snap = await getDocs(q)
    
    if (!snap.empty) {
      // Unlike
      await deleteDoc(snap.docs[0].ref)
      // Decrease article like count
      await updateDoc(doc(db, 'articles', articleId), { likes: increment(-1) })
      return false
    } else {
      // Like
      await addDoc(collection(db, 'likes'), {
        userId,
        articleId,
        createdAt: serverTimestamp()
      })
      // Increase article like count
      await updateDoc(doc(db, 'articles', articleId), { likes: increment(1) })
      return true
    }
  },

  // Check bookmark status
  async isArticleBookmarked(userId: string, articleId: string) {
    const q = query(
      collection(db, 'bookmarks'), 
      where('userId', '==', userId), 
      where('articleId', '==', articleId)
    )
    const snap = await getDocs(q)
    return !snap.empty
  },

  // Toggle bookmark
  async toggleBookmark(userId: string, articleId: string) {
    const q = query(
      collection(db, 'bookmarks'), 
      where('userId', '==', userId), 
      where('articleId', '==', articleId)
    )
    const snap = await getDocs(q)
    
    if (!snap.empty) {
      await deleteDoc(snap.docs[0].ref)
      return false
    } else {
      await addDoc(collection(db, 'bookmarks'), {
        userId,
        articleId,
        createdAt: serverTimestamp()
      })
      return true
    }
  },

  // Check follow status
  async isUserFollowed(followerId: string, followingId: string) {
    const q = query(
      collection(db, 'follows'), 
      where('followerId', '==', followerId), 
      where('followingId', '==', followingId)
    )
    const snap = await getDocs(q)
    return !snap.empty
  },

  // Toggle follow
  async toggleFollow(followerId: string, followingId: string) {
    const q = query(
      collection(db, 'follows'), 
      where('followerId', '==', followerId), 
      where('followingId', '==', followingId)
    )
    const snap = await getDocs(q)
    
    if (!snap.empty) {
      await deleteDoc(snap.docs[0].ref)
      return false
    } else {
      await addDoc(collection(db, 'follows'), {
        followerId,
        followingId,
        createdAt: serverTimestamp()
      })
      return true
    }
  },

  // ==================== Comment Related ====================
  async addComment(comment: any) {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...comment,
      createdAt: serverTimestamp()
    })
    
    // Increase article comment count
    await updateDoc(doc(db, 'articles', comment.articleId), { comments: increment(1) })
    
    return { id: docRef.id, ...comment }
  },

  async getComments(articleId: string) {
    const q = query(collection(db, 'comments'), where('articleId', '==', articleId))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      }
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },


  async addPendingContent(content: any) {
    let videoUrl = content.videoUrl || ''
    if (content.type === 'video' && content.videoFile instanceof File) {
      const filePath = `videos/${content.authorId}/${Date.now()}_${content.videoFile.name}`
      videoUrl = await uploadFile(filePath, content.videoFile)
    }
    let coverUrl = ''
    if (content.images?.[0]) {
      const img = content.images[0]
      if (typeof img === 'string' && img.startsWith('data:')) {
        const blob = dataUrlToBlob(img)
        coverUrl = await uploadFile(`covers/${content.authorId}/${Date.now()}.jpg`, blob)
      } else if (img instanceof File) {
        coverUrl = await uploadFile(`covers/${content.authorId}/${Date.now()}_${img.name}`, img)
      }
    }
    const payload = {
      ...content,
      videoUrl,
      images: [],
      coverImage: coverUrl || '',
      submitTime: serverTimestamp(),
      status: 'pending',
    }

    // 移除不支持的 File 对象
    delete payload.videoFile

    const docRef = await addDoc(collection(db, 'pendingContents'), payload)
    return docRef.id
  },

  async approvePendingContent(contentId: string) {
    console.log('Starting approval for content:', contentId)
    try {
      const pendingRef = doc(db, 'pendingContents', contentId)
      const snap = await getDoc(pendingRef)
      
      if (!snap.exists()) {
        console.error(`Pending content not found in Firebase. Collection: pendingContents, ID: ${contentId}`)
        return false
      }
      
      const content = snap.data()
      console.log('Found pending content:', content)

      // 防止重复审核
      if (content.status === 'approved') {
        console.warn('Content already approved:', contentId)
        return true
      }

      const articlePayload = {
        title: content.title || 'Untitled',
        content: content.content || content.preview || '',
        excerpt: content.preview || '',
        authorId: content.authorId || '',
        authorName: content.author || 'Unknown Author',
        categoryId: content.categoryId || 'cat_001',
        categoryName: content.categoryName || 'Default Category',
        tags: content.tags || [],
        coverImage: content.coverImage || '',
        images: [],
        accessType: content.accessType || 'free',
        price: content.price || 0,
        status: 'published',
        publishedAt: serverTimestamp(),
        isVideo: content.type === 'video',
        videoUrl: content.videoUrl || '',
        duration: content.duration || 'Pending',
        views: 0,
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      
      console.log('Creating article with payload:', articlePayload)

      const docRef = await addDoc(collection(db, 'articles'), articlePayload)
      console.log('Article created with ID:', docRef.id)
      
      // 审核通过后，直接从 pendingContents 队列中移除该记录
      await deleteDoc(pendingRef)
      console.log('Pending content document deleted after approval')
      
      return docRef.id
    } catch (error) {
      console.error('Error approving content in Firebase:', error)
      throw error
    }
  },

  async rejectPendingContent(contentId: string, reason: string) {
    const pendingRef = doc(db, 'pendingContents', contentId)
    await updateDoc(pendingRef, { 
      status: 'rejected',
      rejectReason: reason,
      updatedAt: serverTimestamp()
    })
    return true
  },

  async createUser(user: any) {
    const payload: any = { ...user }
    if (payload.password) {
      const { hash, salt } = await createPasswordHash(payload.password)
      payload.password = hash
      payload.passwordSalt = salt
    }
    const docRef = await addDoc(collection(db, 'users'), {
      ...payload,
      createdAt: serverTimestamp(),
      status: payload.status || 'active',
    })
    return { id: docRef.id, ...payload }
  },

  async getUserByUsername(username: string) {
    const q = query(collection(db, 'users'), where('username', '==', username))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return formatUserDoc(snap.docs[0])
  },

  async listPendingContents() {
    const q = query(collection(db, 'pendingContents'), where('status', '==', 'pending'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ ...d.data(), id: d.id }))
  },

  async getArticles() {
    const snap = await getDocs(collection(db, 'articles'))
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        ...data,
        id: d.id, 
        // 处理时间戳转换，兼容本地 Date 类型
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || undefined),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
      };
    })
  },

  async getUsers() {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map(formatUserDoc)
  },

  async getUserByPhone(phone: string) {
    const q = query(collection(db, 'users'), where('phone', '==', phone))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return formatUserDoc(snap.docs[0])
  },

  async getUserByEmail(email: string) {
    const q = query(collection(db, 'users'), where('email', '==', email))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return formatUserDoc(snap.docs[0])
  },

  async getUserById(id: string | number) {
    // 尝试直接作为文档ID获取
    if (typeof id === 'string') {
      const docRef = doc(db, 'users', id)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return formatUserDoc(snap)
      }
    }

    // 如果不是文档ID，尝试作为字段查询
    const q = query(collection(db, 'users'), where('id', '==', id))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return formatUserDoc(snap.docs[0])
    }
    
    return null
  },

  async updateUser(id: string | number, updates: any) {
    let docRef = null
    const payload: any = { ...updates }
    if (payload.password) {
      const { hash, salt } = await createPasswordHash(payload.password)
      payload.password = hash
      payload.passwordSalt = salt
    }
    
    if (typeof id === 'string') {
      // 尝试直接作为文档ID
      const ref = doc(db, 'users', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        docRef = ref
      }
    }
    
    if (!docRef) {
      // 查询id字段
      const q = query(collection(db, 'users'), where('id', '==', id))
      const snap = await getDocs(q)
      if (!snap.empty) {
        docRef = snap.docs[0].ref
      }
    }

    if (docRef) {
      await updateDoc(docRef, {
        ...payload,
        updatedAt: serverTimestamp()
      })
      return true
    }
    return false
  },

  async getArticleById(id: string) {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return { 
        id: snap.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || undefined),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
      };
    }
    return null;
  },

  async incrementArticleView(id: string) {
    const ref = doc(db, 'articles', id)
    await updateDoc(ref, {
      views: increment(1)
    })
  },

  // ==================== Point Transaction Related ====================
  
  async addPointTransaction(transaction: any) {
    const docRef = await addDoc(collection(db, 'pointTransactions'), {
      ...transaction,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...transaction }
  },

  async getPointTransactions(userId?: string) {
    let q
    if (userId) {
      q = query(collection(db, 'pointTransactions'), where('userId', '==', userId))
    } else {
      q = query(collection(db, 'pointTransactions'))
    }
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  // ==================== 文章购买相关 ====================

  async addPurchasedArticle(record: any) {
    const docRef = await addDoc(collection(db, 'purchasedArticles'), {
      ...record,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...record }
  },

  async isArticlePurchased(userId: string, articleId: string) {
    const q = query(
      collection(db, 'purchasedArticles'),
      where('userId', '==', userId),
      where('articleId', '==', articleId)
    )
    const snap = await getDocs(q)
    return !snap.empty
  },

  // ==================== Recharge Order Related ====================
  async getRechargeOrders() {
    const snap = await getDocs(collection(db, 'rechargeOrders'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getUserRechargeOrders(userId: string) {
    const q = query(collection(db, 'rechargeOrders'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async createRechargeOrder(order: any) {
    const docRef = await addDoc(collection(db, 'rechargeOrders'), {
      ...order,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...order }
  },

  async updateRechargeOrder(id: string, updates: any) {
    const docRef = doc(db, 'rechargeOrders', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return true
  },

  async getRechargeOrder(id: string) {
    const docRef = doc(db, 'rechargeOrders', id)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() }
    }
    return null
  },

  // ==================== 会员记录相关 ====================
  async addMembershipRecord(record: any) {
    const docRef = await addDoc(collection(db, 'membershipRecords'), {
      ...record,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...record }
  },

  async getMembershipRecords() {
    const snap = await getDocs(collection(db, 'membershipRecords'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getUserMembershipRecords(userId: string) {
    const q = query(collection(db, 'membershipRecords'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  // ==================== 提现申请相关 ====================
  async getWithdrawRequests() {
    const snap = await getDocs(collection(db, 'withdrawRequests'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async createWithdrawRequest(request: any) {
    const docRef = await addDoc(collection(db, 'withdrawRequests'), {
      ...request,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...request }
  },

  async updateWithdrawRequest(id: string, updates: any) {
    const docRef = doc(db, 'withdrawRequests', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return true
  },

  async getUserWithdrawRequests(userId: string) {
    const q = query(collection(db, 'withdrawRequests'), where('userId', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getWithdrawRequestById(id: string) {
    const docRef = doc(db, 'withdrawRequests', id)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() }
    }
    return null
  },

  async uploadContentImage(authorId: string | number, file: File | Blob): Promise<string> {
    const safeAuthorId = String(authorId || 'unknown')
    const fileName = file instanceof File && file.name ? file.name : 'content-image'
    const path = `contentImages/${safeAuthorId}/${Date.now()}_${fileName}`
    return uploadFile(path, file)
  }
}
