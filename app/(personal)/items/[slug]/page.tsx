import { ItemPage } from 'components/pages/item/ItemPage'
import ItemPagePreview from 'components/pages/item/ItemPagePreview'
import { getItemBySlug } from 'lib/sanity.fetch'
import { itemBySlugQuery } from 'lib/sanity.queries'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { LiveQuery } from 'next-sanity/preview/live-query'

// このページは詳細ページである。

export const runtime = 'edge'

type Props = {
  params: { slug: string }
}

export default async function ItemSlugRoute({ params }: Props) {
  // ここでデータの取得を行っている。
  const data = await getItemBySlug(params.slug)

  // エラーハンドリング
  if (!data && !draftMode().isEnabled) {
    notFound()
  }

  // LiveQueryはSanityが提供している。
  // as={}はStudio(管理画面)でのプレビューに使われている。
  return (
    <LiveQuery
      enabled={draftMode().isEnabled}
      query={itemBySlugQuery}
      params={params}
      initialData={data}
      as={ItemPagePreview}
    >
      <ItemPage data={data} />
    </LiveQuery>
  )
}
