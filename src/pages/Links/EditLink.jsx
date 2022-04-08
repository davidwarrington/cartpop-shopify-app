import { useCallback, useEffect, useState } from "react";
import { Button, Card, Page, Frame } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";

import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";
import { PAGE_STATES } from "../../constants";
import { userLoggedInFetch } from "../../helpers";
import SaveBar from "../../components/SaveBar";
import { LinkForm } from "../../components/LinkForm";

const EditLink = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [toast, setToast] = useState(null);
  const [pageState, setPageState] = useState(
    id ? PAGE_STATES.loading : PAGE_STATES.not_found
  );
  const [link, setLink] = useState(null);

  const pageTitle = (link && (link.name || link._id)) || "Edit link";

  async function getLinks() {
    if (pageState !== PAGE_STATES.loading) {
      setPageState(PAGE_STATES.loading);
    }

    try {
      const linkRes = await fetchFunction(`/api/links/${id}`).then((res) =>
        res.json()
      );

      if (!linkRes) {
        throw `Link not found`;
      }

      setLink(linkRes);
      setPageState(PAGE_STATES.idle);
    } catch (e) {
      console.warn(e);
      setPageState(PAGE_STATES.not_found);
    }
  }

  useEffect(() => {
    getLinks();
  }, [id]);

  const handleUpdate = useCallback(async (fields) => {
    setPageState(PAGE_STATES.submitting);

    const apiRes = await fetchFunction(`/api/links/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        fields,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    // Check if update failed
    if (apiRes !== true) {
      setToast({
        show: true,
        content: "Failed to update link. Please try again or contact support",
        error: true,
      });
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully updated",
    });

    setPageState(PAGE_STATES.idle);
  }, []);

  const handleDelete = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    // Send delete request to api
    const apiRes = await fetchFunction(`/api/links/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());

    // Check if delete failed
    if (apiRes !== true) {
      setToast({
        show: true,
        content: "Failed to create link. Please try again or contact support",
        error: true,
      });
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully deleted",
    });

    // Redirect to home
    navigate(`/`);
  }, []);

  const handleCopy = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    // Send copy request to api
    const apiRes = await fetchFunction(`/api/links/${id}/copy`, {
      method: "PUT",
    }).then((res) => res.json());

    // Check if copy failed
    if (!apiRes || !apiRes.id) {
      setToast({
        show: true,
        content: "Failed to copy link. Please try again or contact support",
        error: true,
      });
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully copied",
    });

    // Redirect to link edit page
    const newLinkId = apiRes.id;
    navigate(`/links/${newLinkId}`);
  }, []);

  if (pageState === PAGE_STATES.not_found) {
    return (
      <Page narrowWidth>
        <Card sectioned title="Could not find specified link">
          <Button url="/">Go home</Button>
        </Card>
      </Page>
    );
  }

  if (!link || pageState === PAGE_STATES.loading) {
    return <SkeletonLinkPage />;
  }

  return (
    <Frame>
      <LinkForm
        showSuccess={state && state.new}
        pageTitle={pageTitle}
        pageState={pageState}
        link={link}
        toast={toast}
        setToast={setToast}
        //
        handleDelete={handleDelete}
        handleSubmit={handleUpdate}
        handleCopy={handleCopy}
      />
    </Frame>
  );
};

export default EditLink;
