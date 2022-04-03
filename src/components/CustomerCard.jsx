import { useCallback, useState } from "react"
import {
    Button,
    Card,
    FormLayout,
    Stack,
    TextField,
    Modal,
} from "@shopify/polaris"

export function CustomerCard({
    
}) {
    const [showModal, setShowModal] = useState(false)
    const [customer, setCustomer] = useState({})

    const toggleModalVisibility = useCallback(() => {
        setShowModal(showModal => !showModal);
    }, [])

    const hasCustomerInfo = customer && Object.keys(customer).length;

    return (
        <>
            <Card 
                sectioned 
                title="Customer information" 
                actions={hasCustomerInfo && [
                    {
                        content: "Edit"
                    }
                ]}
            >
                {hasCustomerInfo ? (
                    <>TODO: Customer info here</>
                ) : (
                    <Button primary onClick={toggleModalVisibility}>Add customer information</Button>
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
                            label="Email"
                        />
                        <Stack distribution="fillEvenly">
                            <TextField 
                                label="First name"
                            />
                            <TextField 
                                label="Last name"
                            />
                        </Stack>
                    </FormLayout>
                </Modal.Section>
                <Modal.Section>
                    <FormLayout>
                        <TextField 
                            label="Address line 1"
                        />
                        <TextField 
                            label="Address line 2"
                        />
                        <Stack distribution="fillEvenly">
                            <TextField 
                                label="City"
                            />
                            <TextField 
                                label="State/Province"
                            />
                            <TextField 
                                label="Zipcode"
                            />
                        </Stack>
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </>
    )
}