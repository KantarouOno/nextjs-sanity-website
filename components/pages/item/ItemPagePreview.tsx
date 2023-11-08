'use client'

import dynamic from 'next/dynamic'

// ページをプレヴューするためのコンポーネントである。
// app/item/[slug]で使用されている。

export default dynamic(() => import('./ItemPage'))
