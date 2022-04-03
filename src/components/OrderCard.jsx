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
    Truncate,
    TextContainer,
} from "@shopify/polaris"
import { DiscountsMajor, NoteMajor, PaymentsMajor, ReferralMajor, TickMinor } from "@shopify/polaris-icons"
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
            return cachedOrder
        })
    ))

    const handleAttributeAdd = useCallback(() => (
        setOrder(order => {
            const cachedOrder = {...order}

            if (!cachedOrder.attributes) {
                cachedOrder.attributes = []
            }
            
            cachedOrder.attributes.push({ label: "", value: "" })
            return cachedOrder
        })
    ), [])

    const handleAttributeRemove = useCallback((attributeIndex) => (
        setOrder(order => {
            const cachedOrder = {...order}

            if (!cachedOrder.attributes || !cachedOrder.attributes[attributeIndex]) {
                return cachedOrder
            }

            cachedOrder.attributes.splice(attributeIndex, 1)

            if (!cachedOrder.attributes.length) {
                delete cachedOrder.attributes
            }

            return cachedOrder
        })
    ), [])

    const handleAttributeChange = useCallback(({ index, field, newValue }) => (
        setOrder(order => {
            const cachedOrder = {...order}

            if (!cachedOrder.attributes || !cachedOrder.attributes[index]) {
                return cachedOrder
            }

            cachedOrder.attributes[index][field] = newValue
            return cachedOrder
        })
    ))

    const hasOrderInfo = order && Object.keys(order).length

    return (
        <>
            <Card 
                title="Order information"
                primaryFooterAction={!hasOrderInfo ? {
                    content: "Add",
                    onAction: toggleModalVisibility,
                    accessibilityLabel: "Add order information"
                } : null}
                actions={hasOrderInfo && [
                    {
                        content: "Edit",
                        onAction: toggleModalVisibility,
                    }
                ]}
            >
                {hasOrderInfo ? (
                    <>
                        {order.discountCode || order.ref || order.useShopPay ? (
                            <Card.Section>
                                <CardGrid>
                                    {order.discountCode ? (
                                        <Stack alignment="center" spacing="tight" wrap={false}>
                                            <div style={iconStyles}>
                                                <Icon source={DiscountsMajor} color="base" />
                                            </div>
                                            <Stack.Item fill>
                                                <Stack vertical spacing="none">
                                                    <Subheading><TextStyle variation="subdued">Discount code</TextStyle></Subheading>
                                                    <Stack.Item>{order.discountCode}</Stack.Item>
                                                </Stack>
                                            </Stack.Item>
                                        </Stack>
                                    ) : null}
                                    {order.note ? (
                                        <Stack alignment="center" spacing="tight" wrap={false}>
                                            <div style={iconStyles}>
                                                <Icon source={NoteMajor} color="base" />
                                            </div>
                                            <Stack.Item fill>
                                                <Stack vertical spacing="none">
                                                    <Subheading><TextStyle variation="subdued">Order note</TextStyle></Subheading>
                                                    <Stack.Item>
                                                        <TextContainer>
                                                            {order.note && order.note.length > 50 ? order.note.substring(0, 50) + "..." : order.note}
                                                        </TextContainer>
                                                    </Stack.Item>
                                                </Stack>
                                            </Stack.Item>
                                        </Stack>
                                    ) : null}
                                    {order.ref ? (
                                        <Stack alignment="center" spacing="tight" wrap={false}>
                                            <div style={iconStyles}>
                                                <Icon source={ReferralMajor} color="base" />
                                            </div>
                                            <Stack.Item fill>
                                                <Stack vertical spacing="none">
                                                    <Subheading><TextStyle variation="subdued">Ref</TextStyle></Subheading>
                                                    <Stack.Item>{order.ref}</Stack.Item>
                                                </Stack>
                                            </Stack.Item>
                                        </Stack>
                                    ) : null}
                                    {order.useShopPay ? (
                                        <Stack alignment="center" spacing="tight" wrap={false}>
                                            <div style={iconStyles}>
                                                <Icon source={PaymentsMajor} color="base" />
                                            </div>
                                            <Stack vertical spacing="none">
                                                <Stack spacing="extraTight">
                                                    <Icon color="success" source={TickMinor} /> 
                                                    <Stack.Item>Redirect to Shop Pay</Stack.Item>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ) : null}
                                </CardGrid>
                            </Card.Section>
                        ) : null}
                        {order.attributes && order.attributes.length ? (
                            <Card.Section title={(
                                <Subheading><TextStyle variation="subdued">Order note attributes</TextStyle></Subheading>
                            )}>
                                {order.attributes.map((attribute, attributeIndex) => (
                                    <Card.Subsection key={attributeIndex}>
                                        <TextStyle variation="strong">{attribute.label || <TextStyle variation="negative">Missing attribute label</TextStyle>}:</TextStyle> {attribute.value || <TextStyle variation="negative">Missing attribute value</TextStyle>}
                                    </Card.Subsection>
                                ))}
                            </Card.Section>
                        ) : null}
                    </>
                ) : (
                    <Card.Section>
                        <TextStyle variation="subdued">No order information included on checkout link.</TextStyle>
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
                            showCharacterCount
                            type="text"
                            label="Discount code" 
                            maxLength={255}
                            value={order && order.discountCode}
                            onChange={(value) => handleOrderChange({ field: "discountCode", value })}
                        />
                        <TextField
                            showCharacterCount
                            type="text"
                            label="Note" 
                            multiline={3}
                            maxLength={5000}
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
                    <FormLayout>
                        <Subheading>Order attributes</Subheading>
                        {order.attributes && order.attributes.length ? order.attributes.map((attribute, attributeIndex) => (
                            <Stack alignment="trailing" key={attributeIndex}>
                                <TextField 
                                    requiredIndicator
                                    label="Label" 
                                    value={attribute.label}
                                    onChange={(newValue) => handleAttributeChange({ index: attributeIndex, field: "label", newValue })}
                                />
                                <TextField 
                                    requiredIndicator
                                    label="Value"
                                    value={attribute.value}
                                    onChange={(newValue) => handleAttributeChange({ index: attributeIndex, field: "value", newValue })}
                                />
                                <Button 
                                    accessibilityLabel="Remove attribute"
                                    onClick={() => handleAttributeRemove(attributeIndex)}
                                >Remove</Button>
                            </Stack>
                        )): (
                            <TextStyle variation="subdued">No order note attributes specified.</TextStyle>
                        )}
                    
                        <Button 
                            primary
                            onClick={handleAttributeAdd} 
                            disabled={order.attributes && order.attributes.length === 10}
                        >{!order.attributes || order.attributes.length !== 10 ? "Add attribute" : "10/10 attributes reached"}</Button>
                    </FormLayout>
                </Modal.Section>
                <Modal.Section>
                    <FormLayout>
                        <Checkbox
                            label="Redirect to Shop Pay"
                            checked={order.useShopPay}
                            onChange={(checked) => handleOrderChange({ field: "useShopPay", value: checked })}
                        />
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </>
    )
}