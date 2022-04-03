import { useCallback, useState } from "react"
import {
    Button,
    Card,
    FormLayout,
    Icon,
    Layout,
    Modal,
    Stack,
    Subheading,
    TextField,
    TextStyle,
} from "@shopify/polaris"
import { CustomersMajor, EmailMajor, LocationMajor } from "@shopify/polaris-icons"

const iconStyles = {
    position: "relative",
    display: "flex",
    flex: "0 0 auto",
    height: "2.5rem",
    width: "2.5rem",
    marginRight: "0.75rem",
    background: "var(--p-surface-neutral)",
    borderRadius: "50%",
}

export function CustomerCard({
    
}) {
    const [showModal, setShowModal] = useState(false)
    const [customer, setCustomer] = useState({})

    const toggleModalVisibility = useCallback(() => {
        setShowModal(status => !status)
    }, [])

    const handleCustomerChange = useCallback(({ field, value }) => (
        setCustomer(customer => {
            const cachedCustomer = {...customer}
            cachedCustomer[field] = value
            return cachedCustomer;
        })
    ))

    const hasCustomerInfo = customer && Object.keys(customer).length

    return (
        <>
            <Card 
                sectioned 
                title="Customer information" 
                actions={hasCustomerInfo && [
                    {
                        content: "Edit",
                        onAction: toggleModalVisibility,
                    }
                ]}
            >
                {hasCustomerInfo ? (
                    <Stack distribution="fillEvenly">
                        {customer.email ? (
                            <Layout.Section oneHalf>
                                <Stack alignment="center" spacing="tight">
                                    <div style={iconStyles}>
                                        <Icon source={EmailMajor} color="base" />
                                    </div>
                                    <Stack vertical spacing="extraTight">
                                        <Subheading><TextStyle variation="subdued">Email</TextStyle></Subheading>
                                        <Stack.Item>{customer.email}</Stack.Item>
                                    </Stack>
                                </Stack>
                            </Layout.Section>
                        ) : null}
                        {customer.first_name || customer.last_name ? (
                            <Layout.Section oneHalf>
                                <Stack alignment="center" spacing="tight">
                                    <div style={iconStyles}>
                                        <Icon source={CustomersMajor} color="base" />
                                    </div>
                                    <Stack vertical spacing="extraTight">
                                        <Subheading><TextStyle variation="subdued">Name</TextStyle></Subheading>
                                        <Stack.Item>{customer.first_name + " "}{customer.last_name}</Stack.Item>
                                    </Stack>
                                </Stack>
                            </Layout.Section>
                        ) : null}
                        {(customer.address1 || customer.address2 || customer.city || customer.province || customer.zipcode) ? (
                            <Layout.Section oneHalf>
                                <Stack alignment="center" spacing="tight">
                                    <div style={iconStyles}>
                                        <Icon source={LocationMajor} color="base" />
                                    </div>
                                    <Stack vertical spacing="extraTight">
                                        <Subheading><TextStyle variation="subdued">Shipping address</TextStyle></Subheading>
                                        <Stack.Item>{customer.address1}{customer.address2 && ", " + customer.address2}{customer.city && ", " + customer.city}{customer.province && ", " + customer.province}</Stack.Item>
                                        <Stack.Item>{customer.zipcode && customer.zipcode}{customer.country && ", " + customer.country}</Stack.Item>
                                    </Stack>
                                </Stack>
                            </Layout.Section>
                        ) : null}

                    </Stack>
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
                            type="email"
                            label="Email"
                            placeholder="example@example.com"
                            value={customer && customer.email}
                            onChange={(value) => handleCustomerChange({ field: "email", value })}
                        />
                        <Stack distribution="fillEvenly">
                            <TextField 
                                type="text"
                                label="First name"
                                placeholder="Tobi"
                                value={customer && customer.first_name}
                                onChange={(value) => handleCustomerChange({ field: "first_name", value })}
                            />
                            <TextField 
                                type="text"
                                label="Last name"
                                placeholder="Lütke"
                                value={customer && customer.last_name}
                                onChange={(value) => handleCustomerChange({ field: "last_name", value })}
                            />
                        </Stack>
                    </FormLayout>
                </Modal.Section>
                <Modal.Section>
                    <FormLayout>
                    <Subheading>Shipping address</Subheading>
                        <TextField 
                            type="text"
                            label="Address line 1"
                            value={customer && customer.address1}
                            onChange={(value) => handleCustomerChange({ field: "address1", value })}
                        />
                        <TextField 
                            type="text"
                            label="Address line 2"
                            value={customer && customer.address2}
                            onChange={(value) => handleCustomerChange({ field: "address2", value })}
                        />
                        <Stack distribution="fillEvenly">
                            <TextField 
                                type="text"
                                label="City"
                                placeholder="New York"
                                value={customer && customer.city}
                                onChange={(value) => handleCustomerChange({ field: "city", value })}
                            />
                            <TextField 
                                label="State/Province"
                                placeholder="New York"
                            />
                            <TextField 
                                label="Zipcode"
                                placeholder="10022"
                            />
                        </Stack>
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </>
    )
}