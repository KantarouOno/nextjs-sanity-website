import { CustomPortableText } from 'components/shared/CustomPortableText'
import { Header } from 'components/shared/Header'
import ImageBox from 'components/shared/ImageBox'
import type { ItemPayload } from 'types'

// このファイルは取得したデータの表示を行っている。

export interface ItemPageProps {
  data: ItemPayload | null
}

export function ItemPage({ data }: ItemPageProps) {
  const {
    description,
    title,
    article,
    thumbnailImage,
    imagesGallery,
    category,
  } = data ?? {}

  return (
    <div>
      <Header title={title} />
      <div className="mb-10 mt-10 space-y-6">
        <div>
          <div className="font-bold">カテゴリー</div>
          {category &&
            category.map((c) => {
              return (
                <span className="pr-10" key={c._key}>
                  カテゴリー:{c.title}
                </span>
              )
            })}
        </div>
        <div className="rounded-md">
          <div className="font-bold">サムネイル</div>
          <ImageBox
            image={thumbnailImage}
            alt={`Cover image for ${title}`}
            classesWrapper="relative aspect-[16/9]"
          />
        </div>
        <div className="mb-20">
          <div className="font-bold">説明</div>
          {description}
        </div>
      </div>
      <div className="font-bold">ギャラリー</div>
      <div>
        {imagesGallery &&
          imagesGallery.map((i) => {
            return (
              <div key={i.asset?._key} style={{ paddingBottom: '8px' }}>
                <ImageBox
                  image={i}
                  alt={`Cover image for ${title}`}
                  classesWrapper="relative aspect-[16/9]"
                />
              </div>
            )
          })}
      </div>
      <div className="mt-20">
        <div className="font-bold">記事</div>
        {article && (
          <CustomPortableText
            paragraphClasses="font-serif max-w-3xl text-xl text-gray-600"
            value={article}
          />
        )}
      </div>
    </div>
  )
}

export default ItemPage
