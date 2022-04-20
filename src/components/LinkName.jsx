import { Card, Modal, TextField } from "@shopify/polaris";

const Container = ({ showModal, toggleModal, handleRename, children }) => {
  if (handleRename) {
    return (
      <Modal
        open={showModal}
        onClose={toggleModal}
        title="Rename link"
        secondaryActions={{
          content: "Close",
          onAction: toggleModal,
        }}
        // primaryAction={{
        //   content: "Save",
        //   onAction: handleRename,
        // }}
      >
        <Modal.Section>{children}</Modal.Section>
      </Modal>
    );
  }

  return <Card sectioned>{children}</Card>;
};

export function LinkName({
  name,
  showModal = false,
  toggleModal = null,
  handleRename,
}) {
  return (
    <Container
      showModal={showModal}
      toggleModal={toggleModal}
      handleRename={handleRename}
    >
      <TextField
        label="Link name"
        placeholder="BFCM Marketing Campaign"
        helpText="Internal only. Not shown to customers."
        autoComplete="off"
        autoFocus={true}
        {...name}
      />
    </Container>
  );
}
