import { useCallback, useState } from "react"
import {
    Banner,
    Button,
    Card,
    Checkbox,
    FormLayout,
    Stack,
    TextField,
    Modal,
    Subheading,
    TextStyle,
} from "@shopify/polaris"

export function OrderCard({

}) {
    const [showModal, setShowModal] = useState(false)
    const [discountCode, setDiscount] = useState("")
    const [note, setNote] = useState("")
    const [ref, setRef] = useState("")
    const [useShopPay, setShopPay] = useState(false)
    
    const toggleModalVisibility = useCallback(() => {
        setShowModal(showModal => !showModal)
    }, [])

    const hasOrderInfo = discountCode || note || ref

    return (
        <>
            <Card 
                sectioned
                title="Order information"
                actions={hasOrderInfo && [
                    {
                        content: "Edit"
                    }
                ]}
            >
                {hasOrderInfo ? (
                    <>Order information goes here</>
                ) : (
                    <Button primary onClick={toggleModalVisibility}>Add order information</Button>
                )}
            </Card>
            <Modal 
                open={showModal} 
                onClose={toggleModalVisibility}
                title="Order information"
                secondaryActions={[
                    {
                        content: "Save and close",
                        onAction: toggleModalVisibility,
                    }
                ]}
            >
                <Modal.Section>
                    <FormLayout>
                        <TextField
                            type="text"
                            label="Discount code" 
                            value={discountCode} 
                        />
                        <TextField
                            type="text"
                            label="Note" 
                            value={note} 
                            multiline={3}
                            maxLength={5000}
                            showCharacterCount
                        />
                        <TextField
                            type="text"
                            label="Ref" 
                            value={ref} 
                        />
                    </FormLayout>
                </Modal.Section>
                <Modal.Section>
                    <Subheading>Order attributes</Subheading>
                    <FormLayout>
                        <TextStyle>None specified</TextStyle>
                    
                        <Button>Add attribute</Button>
                    </FormLayout>
                </Modal.Section>
                <Modal.Section>
                    <FormLayout>
                        <Checkbox
                            label="Redirect to Shop Pay"
                            checked={useShopPay}
                        />
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </>
    )
}