import React, { Component } from "react";
import { Button, Modal as BootstrapModal, Form, Alert } from "react-bootstrap";
import { Field, reduxForm } from "redux-form";

class Modal extends Component {
  renderError = (meta) => {
    const { error, touched } = meta;

    if (error && touched) {
      return <Alert variant="danger">{error}</Alert>;
    }
  };

  renderTextfield = (props) => {
    const { input, label, placeholder, meta } = props;

    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>

        {this.renderError(meta)}

        <Form.Control
          {...input}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
        />
      </Form.Group>
    );
  };

  renderTextarea = (props) => {
    const { input, label, placeholder, meta } = props;

    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>

        {this.renderError(meta)}

        <Form.Control
          {...input}
          as="textarea"
          rows="3"
          placeholder={placeholder}
        />
      </Form.Group>
    );
  };

  handleCreateNote = async () => {
    const { createNote, title, content, closeModal, reset } = this.props;

    await createNote({ title, content });

    closeModal();

    reset();
  };

  render() {
    const { visible, openModal, closeModal, valid, googleAuth2 } = this.props;

    const renderBasedOnAuth = () => {
      if (googleAuth2.isSignedIn) {
        return (
          <>
            <Button variant="success" onClick={openModal}>
              Add new
            </Button>

            <BootstrapModal show={visible} onHide={closeModal}>
              <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>Add a new note</BootstrapModal.Title>
              </BootstrapModal.Header>

              <BootstrapModal.Body>
                <Form>
                  <Field
                    name="title"
                    label="Enter title"
                    placeholder="Note title"
                    component={this.renderTextfield}
                  />

                  <Field
                    name="content"
                    label="Enter content"
                    placeholder="Note content"
                    component={this.renderTextarea}
                  />
                </Form>
              </BootstrapModal.Body>

              <BootstrapModal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>

                <Button
                  variant="success"
                  disabled={!valid}
                  onClick={this.handleCreateNote}
                >
                  Save
                </Button>
              </BootstrapModal.Footer>
            </BootstrapModal>
          </>
        );
      } else if (googleAuth2.isSignedIn === false) {
        return (
          <div className="alert alert-danger">
            Please first sign in with Google in order to add a new note.
          </div>
        );
      } else {
        return "";
      }
    };

    return <div className="modal-wrapper">{renderBasedOnAuth()}</div>;
  }
}

const validate = (formValues) => {
  const errors = {};

  if (!formValues.title) {
    errors.title = "Title cannot be empty.";
  } else if (formValues.title.length < 3) {
    errors.title = "Title must be at least 3 characters long.";
  }

  if (!formValues.content) {
    errors.content = "Content cannot be empty.";
  } else if (formValues.content.length < 5) {
    errors.content = "Content must be at least 5 characters long.";
  }

  return errors;
};

export default reduxForm({
  form: "modal",
  destroyOnUnmount: false,
  validate,
})(Modal);
