'use client'
import ImageBox from 'components/shared/ImageBox'
import Link from 'next/link'
import { FC } from 'react'
import { ItemPayload } from 'types'

// このファイルでは取得したアイテムの一覧を表示している。

type Props = {
  items: ItemPayload[]
}

export const ItemList: FC<Props> = ({ items }) => {
  return (
    <>
      {items &&
        items.map((i) => {
          return (
            <Link key={i.slug} href={`/items/${i.slug?.current}`}>
              <div className="border flex w-fit mb-4">
                <h4 style={{ minWidth: '100px' }}>{i.title}</h4>
                <div className="rounded-md">
                  <ImageBox
                    image={i.thumbnailImage}
                    alt={`Cover image for ${i.title}`}
                    classesWrapper="relative aspect-[16/9] h-48 w-96 object-cover"
                  />
                </div>
              </div>
            </Link>
          )
        })}
    </>
  )
}
