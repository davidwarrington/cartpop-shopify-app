import { useCallback, useState } from "react"
import {
    Banner,
    Button,
    Card,
    FormLayout,
    Stack,
    TextField,
    Modal,
} from "@shopify/polaris"

export function OrderCard({

}) {
    const [showModal, setShowModal] = useState(false)
    const [discountCode, setDiscount] = useState("")
    const [note, setNote] = useState("")
    const [ref, setRef] = useState("")
    
    const toggleModalVisibility = useCallback(() => {
        setShowModal(showModal => !showModal);
    }, [])

    const hasOrderInfo = discountCode || note || ref;

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
                    <Button primary>Add order information</Button>
                )}
            </Card>
            <Modal 
                open={showModal} 
                onClose={toggleModalVisibility}
                title="Customer information"
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
                            label="Discount code" 
                            value={discountCode} 
                        />
                        <TextField
                            label="Note" 
                            value={note} 
                            multiline={3}
                            //maxLength={}
                            showCharacterCount
                        />
                        <TextField
                            label="Ref" 
                            value={ref} 
                        />
                    </FormLayout>
                </Modal.Section>
                <Modal.Section>
                    <FormLayout>
                        // TODO: attributes
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </>
    )
}