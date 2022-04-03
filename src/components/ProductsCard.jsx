import { useCallback, useState } from "react"
import {
    Card,
} from "@shopify/polaris"
import { ResourcePicker } from "@shopify/app-bridge-react"
import { ProductList } from "./ProductList"

export function ProductsCard({
    products,
    setProducts
}) {
    const [showPicker, setShowPicker] = useState(false)
    
    const togglePickerVisibility = useCallback(() => {
        setShowPicker(showPicker => !showPicker)
    }, [])

    const handleClosePicker = useCallback(() => {
        setShowPicker(false)
    }, [])

    const handleProductSelection = useCallback(({ selection }) => {
        // Set all selected products (overrides existing)
        console.log("selection", selection)
        // TODO: prevent overwriting Quantity
        setProducts(selection)
    }, [])

    const handleVariantRemove = useCallback((productIndex, variantIndex) => {
        if (productIndex < 0 || variantIndex < 0) {
            return
        }

        // Remove product at specified index
        return setProducts(products => {
            const cachedProducts = [...products]
            cachedProducts[productIndex] 
                && cachedProducts[productIndex].variants[variantIndex]
                && cachedProducts[productIndex].variants.splice(variantIndex, 1)

            if (cachedProducts[productIndex].variants 
                || cachedProducts[productIndex].variants.length === 0) {
                cachedProducts.splice(productIndex, 1)
            }
            return cachedProducts
        })
    }, [])

    const hasProducts = products && products.length

    return (
        <>
            <Card 
                sectioned
                title="Products"
                actions={hasProducts && [
                    {
                        content: "Edit products",
                        onAction: togglePickerVisibility,
                    }
                ]}
            >
                <ProductList 
                    products={products} 
                    handleVariantRemove={handleVariantRemove}
                    togglePickerVisibility={togglePickerVisibility}
                />
            </Card>
            {/* Learn more: https://shopify.dev/apps/tools/app-bridge/react-components/resourcepicker */}
            <ResourcePicker
                open={showPicker}
                // We use Product since the ProductVariant resource picker has terrible UX
                resourceType="Product"
                // Populated with the current selection
                initialSelectionIds={products && products.length ? products.map(product => { return {
                    id: product.id,
                    variants: product.variants
                }}) : []}
                showDraft={false}
                showHidden={false}
                showArchived={false}
                allowMultiple={true}
                onCancel={handleClosePicker}
                onSelection={handleProductSelection}
            />
        </>
    )
}