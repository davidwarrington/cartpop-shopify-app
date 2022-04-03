import { useCallback, useState } from "react"
import {
    Banner,
    Button,
    Card,
    Checkbox,
    FormLayout,
    Stack,
    Subheading,
    TextField,
    TextStyle,
} from "@shopify/polaris"
import { ResourcePicker } from "@shopify/app-bridge-react"

export function ProductsCard({

}) {
    const [showPicker, setShowPicker] = useState(false)
    const [products, setProducts] = useState([])
    
    const togglePickerVisibility = useCallback(() => {
        setShowPicker(showPicker => !showPicker)
    }, [])

    const handleClosePicker = useCallback(() => {
        setShowPicker(false)
    }, [])

    const hasProducts = products && products.length

    return (
        <>
            <Card 
                sectioned
                title="Products"
                actions={hasProducts && [
                    {
                        content: "Edit"
                    }
                ]}
            >
                {hasProducts ? (
                    <>Products go here</>                    
                ) : (
                    <Stack vertical>
                        <TextStyle variation="subdued">No products selected.</TextStyle>
                        <Button primary onClick={togglePickerVisibility}>Add product</Button>
                    </Stack>
                )}
            </Card>
            {/* Learn more: https://shopify.dev/apps/tools/app-bridge/react-components/resourcepicker */}
            <ResourcePicker
                open={showPicker}
                // We use Product since the ProductVariant resource picker has terrible UX
                resourceType="Product"
                // Populated with the current selection
                initialSelectionIds={[]}

                showDraft={false}
                showHidden={false}
                showArchived={false}
                allowMultiple={true}
                onCancel={handleClosePicker}
                onSelection={() => { 
                    //TODO: 
                }}
            />
        </>
    )
}