import { getExtension } from '@sanity/asset-utils'
import { PackageIcon } from '@sanity/icons'
import ShopifyIcon from 'components/icons/ShopifyIcon'
import ShopifyDocumentStatus from 'components/shopify/ShopifyDocumentStatus'
import pluralize from 'pluralize-esm'
import React from 'react'
import { defineField, defineType } from 'sanity'

// shopifyから取得した、コレクションの情報とSanity独自のカスタムフィールドが定義されています。

const GROUPS = [
  {
    name: 'theme',
    title: 'Theme',
  },
  {
    default: true,
    name: 'editorial',
    title: 'Editorial',
  },
  {
    name: 'shopifySync',
    title: 'Shopify sync',
    icon: ShopifyIcon,
  },
  {
    name: 'seo',
    title: 'SEO',
  },
]

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: PackageIcon,
  groups: GROUPS,
  fields: [
    // Title (proxy)
    defineField({
      name: 'titleProxy',
      title: 'Title',
      type: 'proxyString',
      options: { field: 'store.title' },
    }),
    // Slug (proxy)
    defineField({
      name: 'slugProxy',
      title: 'Slug',
      type: 'proxyString',
      options: { field: 'store.slug.current' },
    }),
    // Vector
    defineField({
      name: 'vector',
      title: 'Vector artwork',
      type: 'image',
      description: 'Displayed in collection links using color theme',
      options: {
        accept: 'image/svg+xml',
      },
      group: 'theme',
      validation: (Rule) =>
        Rule.custom((image) => {
          if (!image?.asset?._ref) {
            return true
          }

          const format = getExtension(image.asset._ref)

          if (format !== 'svg') {
            return 'Image must be an SVG'
          }
          return true
        }),
    }),
    // Show hero
    defineField({
      name: 'showHero',
      title: 'Show hero',
      type: 'boolean',
      description: 'If disabled, page title will be displayed instead',
      group: 'editorial',
    }),
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero.collection',
      hidden: ({ document }) => !document?.showHero,
      group: 'editorial',
    }),
    // Modules
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      description: 'Editorial modules to associate with this collection',
      of: [
        { type: 'module.callout' },
        { type: 'module.callToAction' },
        { type: 'module.image' },
        { type: 'module.instagram' },
      ],
      group: 'editorial',
    }),
    // Shopify collection
    defineField({
      name: 'store',
      title: 'Shopify',
      type: 'shopifyCollection',
      description: 'Collection data from Shopify (read-only)',
      group: 'shopifySync',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.shopify',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      name: 'titleAsc',
      title: 'Title (A-Z)',
      by: [{ field: 'store.title', direction: 'asc' }],
    },
    {
      name: 'titleDesc',
      title: 'Title (Z-A)',
      by: [{ field: 'store.title', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      imageUrl: 'store.imageUrl',
      isDeleted: 'store.isDeleted',
      rules: 'store.rules',
      title: 'store.title',
    },
    prepare(selection) {
      const { imageUrl, isDeleted, rules, title } = selection
      const ruleCount = rules?.length || 0

      return {
        media: (
          <ShopifyDocumentStatus
            isDeleted={isDeleted}
            type="collection"
            url={imageUrl}
            title={title}
          />
        ),
        subtitle:
          ruleCount > 0
            ? `Automated (${pluralize('rule', ruleCount, true)})`
            : 'Manual',
        title,
      }
    },
  },
})
