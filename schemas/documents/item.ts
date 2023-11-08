import { DocumentIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

const categories = [
  { title: '西陣織', value: '1' },
  { title: '磁器', value: '2' },
  { title: '扇', value: '3' },
]

// このファイルで、アイテムのフィールドの定義をする。

// defineField()で一つのフィールドを定義する。

// もちろん１つのフィールドに複数の要素を入力できる。
// 名品帖での工芸メーカーギャラリーは以下のようになる。
// defineField({
//   name: 'imagesGallery',
//   title: 'ギャラリー',
//   type: 'array',
//   of: [{ type: 'image' }],
// }) 

export default defineType({
  name: 'item',
  title: 'Item',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'string',
      name: 'title',
      title: '商品名',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: '説明',
      name: 'description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      name: 'thumbnailImage',
      title: 'サムネイル',
      description: 'サムネイル用の画像です。',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imagesGallery',
      title: 'ギャラリー',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      title: 'カテゴリー',
      name: 'category',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'カテゴリー',
              name: 'title',
              type: 'string',
              options: {
                list: categories,
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare(selection) {
              const category = categories.find(
                (cat) => cat.value === selection.title,
              )
              return {
                title: category ? category.title : 'Unknown category',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'article',
      title: '記事',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                  },
                ],
              },
            ],
          },
          styles: [],
        }),
        defineField({
          type: 'image',
          name: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
          preview: {
            select: {
              imageUrl: 'asset.url',
              title: 'caption',
            },
          },
          fields: [
            defineField({
              title: 'Caption',
              name: 'caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description:
                'Alternative text for screenreaders. Falls back on caption if not set',
            }),
          ],
        }),
      ],
    }),
  ],
})
