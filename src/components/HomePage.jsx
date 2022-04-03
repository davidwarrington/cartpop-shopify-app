import { useState } from "react"
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  FooterHelp,
  Banner,
} from "@shopify/polaris"

import trophyImgUrl from "../assets/home-trophy.png"

import { CheckoutLinkCard } from "./CheckoutLinkCard"
import { ProductsCard } from "./ProductsCard"
import { CustomerCard } from "./CustomerCard"
import { OrderCard } from "./OrderCard"


export function HomePage() {
  const [products, setProducts] = useState([])
  const [customer, setCustomer] = useState({})
  const [order, setOrder] = useState({})

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <ProductsCard products={products} setProducts={setProducts} />
          <CustomerCard customer={customer} setCustomer={setCustomer} />
          <OrderCard order={order} setOrder={setOrder} />
          <br />
          <Banner>
            Made in New York City by <Link url="https://www.checkoutpromotions.com" external>Checkout Promotions</Link>.
          </Banner>
        </Layout.Section>
        <Layout.Section secondary>
          <CheckoutLinkCard 
            products={products}
            customer={customer}
            order={order}
          />
        </Layout.Section>
      </Layout>
    </Page>
  )
}
