/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Enhanced responsive breakpoints
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        // Custom breakpoints
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        // Height breakpoints
        'tall': {'raw': '(min-height: 800px)'},
        'short': {'raw': '(max-height: 600px)'},
      },
      
      // Cool and warm color palettes
      colors: {
        // Cool tones
        cool: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e40af',
          950: '#172554',
        },
        // Warm tones
        warm: {
          50: '#fef7ee',
          100: '#fdeedd',
          200: '#fbd4aa',
          300: '#f8b877',
          400: '#f59e0b',
          500: '#f97316',
          600: '#ea580c',
          700: '#dc2626',
          800: '#b91c1c',
          900: '#991b1b',
          950: '#7c2d12',
        },
        // Mixed tones
        mixed: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Soft gradient colors
        soft: {
          blue: '#6366f1',
          purple: '#8b5cf6',
          pink: '#ec4899',
          rose: '#f43f5e',
          orange: '#f97316',
          amber: '#f59e0b',
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          sky: '#0ea5e9',
        }
      },
      
      // 增强的字体系统
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      
      // 流体字体大小
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // 移动端优化字体
        'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'mobile-base': ['1rem', { lineHeight: '1.5rem' }],
        'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      
      // 增强的间距系统
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '11': '2.75rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '21': '5.25rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '33': '8.25rem',
        '34': '8.5rem',
        '36': '9rem',
        '44': '11rem',
        '50': '12.5rem',
        '60': '15rem',
        '68': '17rem',
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
        '208': '52rem',
        '224': '56rem',
        '240': '60rem',
        '256': '64rem',
        '288': '72rem',
        '320': '80rem',
        '384': '96rem',
        // 移动端安全区域
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // 增强的圆角系统
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        'full': '9999px',
        // 有机形状
        'organic-1': '60% 40% 30% 70%/60% 30% 70% 40%',
        'organic-2': '30% 60% 70% 40%/50% 60% 30% 60%',
        'organic-3': '40% 60% 60% 40%/60% 30% 70% 40%',
        // 移动端友好
        'mobile': '0.5rem',
        'mobile-lg': '0.75rem',
        'mobile-xl': '1rem',
      },
      
      // 增强的阴影系统
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // 彩色阴影
        'cool': '0 10px 25px rgba(30, 58, 138, 0.15), 0 4px 10px rgba(14, 165, 233, 0.1)',
        'warm': '0 10px 25px rgba(249, 115, 22, 0.15), 0 4px 10px rgba(236, 72, 153, 0.1)',
        'mixed': '0 10px 25px rgba(30, 58, 138, 0.1), 0 4px 10px rgba(236, 72, 153, 0.1)',
        'soft': '0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
        // 移动端优化阴影
        'mobile': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'mobile-lg': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'mobile-xl': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      
      // 增强的动画系统
      animation: {
        // 基础动画
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        
        // 自定义动画
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'slide-in-down': 'slideInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-in',
        'rotate-in': 'rotateIn 0.5s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        
        // 流体动画
        'fluid': 'fluid 6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        
        // 移动端优化动画
        'mobile-bounce': 'mobileBounce 0.6s ease-out',
        'mobile-shake': 'mobileShake 0.5s ease-in-out',
        'mobile-wobble': 'mobileWobble 0.8s ease-in-out',
        
        // 性能优化动画
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // 动画关键帧
      keyframes: {
        // 基础关键帧
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg) scale(0.5)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotateY(0)' },
          '40%': { transform: 'perspective(400px) translateZ(150px) rotateY(170deg)', animationTimingFunction: 'ease-out' },
          '50%': { transform: 'perspective(400px) translateZ(150px) rotateY(190deg) scale(1)' },
          '80%': { transform: 'perspective(400px) rotateY(360deg) scale(0.95)', animationTimingFunction: 'ease-in' },
          '100%': { transform: 'perspective(400px) scale(1)' },
        },
        
        // 流体动画关键帧
        fluid: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
          },
          '25%': { 
            transform: 'translate(30px, -30px) rotate(90deg) scale(1.1)',
            borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%',
          },
          '50%': { 
            transform: 'translate(-20px, 20px) rotate(180deg) scale(0.9)',
            borderRadius: '40% 60% 60% 40%/60% 30% 70% 40%',
          },
          '75%': { 
            transform: 'translate(20px, -10px) rotate(270deg) scale(1.05)',
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        
        // 移动端优化关键帧
        mobileBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-15px)' },
          '60%': { transform: 'translateY(-7px)' },
        },
        mobileShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        mobileWobble: {
          '0%, 100%': { transform: 'translateX(0%) rotate(0deg)' },
          '15%': { transform: 'translateX(-10px) rotate(-5deg)' },
          '30%': { transform: 'translateX(8px) rotate(3deg)' },
          '45%': { transform: 'translateX(-6px) rotate(-3deg)' },
          '60%': { transform: 'translateX(4px) rotate(2deg)' },
          '75%': { transform: 'translateX(-2px) rotate(-1deg)' },
        },
      },
      
      // 增强的过渡时长
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      
      // 增强的缓动函数
      transitionTimingFunction: {
        'linear': 'linear',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
        'in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      
      // 增强的 z-index 层级
      zIndex: {
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'auto': 'auto',
        // 语义化层级
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
        'overlay': '900',
        'max': '9999',
      },
      
      // 增强的背景渐变
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-linear': 'linear-gradient(var(--tw-gradient-stops))',
        
        // 预设渐变
        'cool-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #06b6d4 100%)',
        'warm-gradient': 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
        'mixed-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #ec4899 50%, #06b6d4 100%)',
        'soft-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        
        // 玻璃态渐变
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
        
        // 网格图案
        'grid-pattern': 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
        'dot-pattern': 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
      },
      
      // 增强的背景大小
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '50%': '50%',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        'grid': '20px 20px',
        'dot': '10px 10px',
      },
      
      // 增强的最小/最大尺寸
      minHeight: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        'px': '1px',
        'full': '100%',
        'screen': '100vh',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
        // 移动端优化
        'touch': '44px',
        'touch-lg': '48px',
        'mobile-screen': '100vh',
        'mobile-content': 'calc(100vh - 64px)',
        'mobile-content-nav': 'calc(100vh - 128px)',
      },
      
      // 视口单位
      spacing: {
        ...Array.from({ length: 101 }, (_, i) => i).reduce((acc, i) => {
          acc[`${i}vh`] = `${i}vh`;
          acc[`${i}vw`] = `${i}vw`;
          return acc;
        }, {}),
      },
    },
  },
  
  // 自定义插件
  plugins: [
    // 冷暖色调工具类插件
    function({ addUtilities, theme, addBase, addComponents }) {
      // 基础样式重置
      addBase({
        // 移动端优化
        '*': {
          '-webkit-tap-highlight-color': 'transparent',
          '-webkit-touch-callout': 'none',
        },
        
        // 字体渲染优化
        'html': {
          '-webkit-text-size-adjust': '100%',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          'text-rendering': 'optimizeLegibility',
        },
        
        // 滚动优化
        'body': {
          'overscroll-behavior': 'contain',
          '-webkit-overflow-scrolling': 'touch',
        },
        
        // 表单元素优化
        'input, button, textarea, select': {
          'font': 'inherit',
        },
        
        // 图片优化
        'img': {
          'max-width': '100%',
          'height': 'auto',
        },
      });
      
      // 组件样式
      addComponents({
        // 玻璃态按钮
        '.btn-glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'background': 'rgba(255, 255, 255, 0.2)',
            'transform': 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            'transform': 'translateY(0)',
          },
        },
        
        // 渐变按钮
        '.btn-gradient-cool': {
          'background': 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
          'color': 'white',
          'border': 'none',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'background': 'linear-gradient(135deg, #1e40af 0%, #0284c7 100%)',
            'transform': 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(30, 58, 138, 0.3)',
          },
        },
        
        '.btn-gradient-warm': {
          'background': 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
          'color': 'white',
          'border': 'none',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'background': 'linear-gradient(135deg, #ea580c 0%, #db2777 100%)',
            'transform': 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(249, 115, 22, 0.3)',
          },
        },
        
        // 卡片组件
        '.card-glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '1rem',
          'box-shadow': '0 8px 32px rgba(31, 38, 135, 0.15)',
          'transition': 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'transform': 'translateY(-4px) scale(1.02)',
            'box-shadow': '0 15px 40px rgba(31, 38, 135, 0.2)',
          },
        },
        
        // 移动端容器
        '.mobile-container': {
          'max-width': '100%',
          'margin': '0 auto',
          'padding': '0 1rem',
          '@media (min-width: 640px)': {
            'padding': '0 1.5rem',
          },
          '@media (min-width: 1024px)': {
            'max-width': '1200px',
          },
        },
      });
      
      // 工具类
      addUtilities({
        // 性能优化类
        '.gpu-layer': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
          'perspective': '1000',
        },
        
        '.will-change-transform': {
          'will-change': 'transform',
        },
        
        // 触摸优化
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        
        // 滚动优化
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
          '-webkit-overflow-scrolling': 'touch',
        },
        
        // 文本选择
        '.select-none': {
          'user-select': 'none',
          '-webkit-user-select': 'none',
        },
        
        // 安全区域
        '.safe-area-inset': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-right': 'env(safe-area-inset-right)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
        },
      });
    },
  ],
};