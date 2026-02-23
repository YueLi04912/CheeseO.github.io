export interface WithdrawalAccount {
    id: string
    type: 'alipay' | 'bank'
    accountName: string
    accountNumber: string
    bankName?: string
    isDefault: boolean
  }
  
  export interface CreateWithdrawalRequest {
    amount: number
    accountId: string
    note?: string
  }