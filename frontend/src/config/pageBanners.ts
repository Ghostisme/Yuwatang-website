import brand from "@/assets/img/banners/brand.jpg"
import brandMobile from "@/assets/img/banners/brand-mobile.jpg"
import services from "@/assets/img/banners/services.jpg"
import servicesMobile from "@/assets/img/banners/services-mobile.jpg"
import base from "@/assets/img/banners/base.jpg"
import baseMobile from "@/assets/img/banners/base-mobile.jpg"
import stores from "@/assets/img/banners/stores.jpg"
import storesMobile from "@/assets/img/banners/stores-mobile.jpg"
import faq from "@/assets/img/banners/faq.jpg"
import faqMobile from "@/assets/img/banners/faq-mobile.jpg"
import news from "@/assets/img/banners/news.jpg"
import newsMobile from "@/assets/img/banners/news-mobile.jpg"
import reviews from "@/assets/img/banners/reviews.jpg"
import reviewsMobile from "@/assets/img/banners/reviews-mobile.jpg"
import contact from "@/assets/img/banners/contact.jpg"
import contactMobile from "@/assets/img/banners/contact-mobile.jpg"
import trace from "@/assets/img/banners/trace.jpg"
import traceMobile from "@/assets/img/banners/trace-mobile.jpg"

export const pageBanners = {
  brand: { image: brand, mobileImage: brandMobile, titleKey: "pageBanners.brand" },
  services: { image: services, mobileImage: servicesMobile, titleKey: "pageBanners.services" },
  base: { image: base, mobileImage: baseMobile, titleKey: "baseV2.h1" },
  stores: { image: stores, mobileImage: storesMobile, titleKey: "pageBanners.stores" },
  faq: { image: faq, mobileImage: faqMobile, titleKey: "pageBanners.faq" },
  news: { image: news, mobileImage: newsMobile, titleKey: "pageBanners.news" },
  reviews: { image: reviews, mobileImage: reviewsMobile, titleKey: "pageBanners.reviews" },
  contact: { image: contact, mobileImage: contactMobile, titleKey: "pageBanners.contact" },
  trace: { image: trace, mobileImage: traceMobile, titleKey: "pageBanners.trace" }
} as const

export type PageBannerKey = keyof typeof pageBanners
