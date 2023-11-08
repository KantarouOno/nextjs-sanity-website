import { ItemList } from 'components/global/ItemList'
import { getItems } from 'lib/sanity.fetch'

// これは一覧を取得するページである。

export default async function ItemSlugRoute() {
  const items = await getItems()

  return (
    <>
      <h1 className="mb-10 font-bold">Items</h1>
      <ItemList items={items} />
    </>
  )
}
