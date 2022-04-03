import { useCallback, useState } from "react"
import {
    Button,
    Card,
    Checkbox,
    FormLayout,
    Stack,
    TextField,
    Modal,
    Subheading,
    TextStyle,
    Icon,
} from "@shopify/polaris"
import { DiscountsMajor, NoteMajor, PaymentsMajor, ReferralMajor } from "@shopify/polaris-icons"
import { iconStyles } from "../constants"
import { CardGrid } from "./CardGrid"

export function OrderCard({
    order,
    setOrder,
}) {
    const [showModal, setShowModal] = useState(false)
    
    const toggleModalVisibility = useCallback(() => {
        setShowModal(status => !status)
    }, [])

    const handleOrderChange = useCallback(({ field, value }) => (
        setOrder(order => {
            const cachedOrder = {...order}
            cachedOrder[field] = value
            return cachedOrder;
        })
    ))

    const hasOrderInfo = order && Object.keys(order).length

    return (
        <>
            <Card 
                title="Order information"
                actions={hasOrderInfo && [
                    {
                        content: "Edit",
                        onAction: toggleModalVisibility,
                    }
                ]}
            >
                {hasOrderInfo ? (
                    <>
                        <Card.Section>
                            <CardGrid>
                                {order.discountCode ? (
                                    <Stack alignment="center" spacing="tight" wrap={false}>
                                        <div style={iconStyles}>
                                            <Icon source={DiscountsMajor} color="base" />
                                        </div>
                                        <Stack vertical spacing="none">
                                            <Subheading><TextStyle variation="subdued">Discount code</TextStyle></Subheading>
                                            <Stack.Item>{order.discountCode}</Stack.Item>
                                        </Stack>
                                    </Stack>
                                ) : null}
                                {order.ref ? (
                                    <Stack alignment="center" spacing="tight" wrap={false}>
                                        <div style={iconStyles}>
                                            <Icon source={ReferralMajor} color="base" />
                                        </div>
                                        <Stack vertical spacing="none">
                                            <Subheading><TextStyle variation="subdued">Ref</TextStyle></Subheading>
                                            <Stack.Item>{order.ref}</Stack.Item>
                                        </Stack>
                                    </Stack>
                                ) : null}
                                {order.useShopPay ? (
                                    <Stack alignment="center" spacing="tight" wrap={false}>
                                        <div style={iconStyles}>
                                            <Icon source={PaymentsMajor} color="base" />
                                        </div>
                                        <Stack vertical spacing="none">
                                            <Subheading><TextStyle variation="subdued">Redirect to Shop Pay</TextStyle></Subheading>
                                            <Stack.Item>{order.useShopPay}</Stack.Item>
                                        </Stack>
                                    </Stack>
                                ) : null}
                            </CardGrid>
                        </Card.Section>
                        {order.note ? (
                            <Card.Section>        
                                <Stack alignment="center" spacing="tight" wrap={false}>
                                    <div style={iconStyles}>
                                        <Icon source={NoteMajor} color="base" />
                                    </div>
                                    <Stack vertical spacing="none">
                                        <Subheading><TextStyle variation="subdued">Order note</TextStyle></Subheading>
                                        <Stack.Item>{order.note}</Stack.Item>
                                    </Stack>
                                </Stack>
                            </Card.Section>
                        ) : null}
                        {order.attributes && order.attributes.length ? (
                            <Card.Section>
                                // TODO:
                            </Card.Section>
                        ) : null}
                    </>
                ) : (
                    <Card.Section>
                        <Button primary onClick={toggleModalVisibility}>Add order information</Button>
                    </Card.Section>
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
                            value={order && order.discountCode}
                            onChange={(value) => handleOrderChange({ field: "discountCode", value })}
                        />
                        <TextField
                            type="text"
                            label="Note" 
                            multiline={3}
                            maxLength={5000}
                            showCharacterCount
                            value={order && order.note} 
                            onChange={(value) => handleOrderChange({ field: "note", value })}
                        />
                        <TextField
                            type="text"
                            label="Ref" 
                            value={order && order.ref} 
                            onChange={(value) => handleOrderChange({ field: "ref", value })}
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
                            checked={order && order.useShopPay}
                            onChange={(checked) => handleOrderChange({ field: "useShopPay", checked })}
                        />
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </>
    )
}