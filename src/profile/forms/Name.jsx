import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './Name.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

class Name extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const {
      name,
      value,
    } = e.target;
    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  render() {
    const {
      formId, name, visibilityName, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="profile-page__field mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId={formId}
                  isInvalid={error !== null}
                >
                  <label className="edit-section-header" htmlFor={formId} id={`${formId}-label`}>
                    {intl.formatMessage(messages['profile.name.full.name'])}
                  </label>
                  <input
                    data-hj-suppress
                    className="form-control"
                    type="text"
                    id={formId}
                    name={formId}
                    value={name || ''}
                    onChange={this.handleChange}
                    aria-describedby={`${formId}-help-text`}
                  />
                  {error !== null && (
                    <Form.Control.Feedback hasIcon={false}>
                      {error}
                    </Form.Control.Feedback>
                  )}
                  <small className="form-text text-muted" id={`${formId}-help-text`}>
                    {intl.formatMessage(messages['profile.name.details'])}
                  </small>
                </Form.Group>
                <FormControls
                  visibilityId="visibilityName"
                  saveState={saveState}
                  visibility={visibilityName}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.name.full.name'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityName !== null}
                visibility={visibilityName}
              />
              <p data-hj-suppress className="h5">{name}</p>
              <small className="form-text text-muted">
                {intl.formatMessage(messages['profile.name.details'])}
              </small>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.name.full.name'])}
                showVisibility={visibilityName !== null}
                visibility={visibilityName}
              />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.name.empty'])}
              </EmptyContent>
              <small className="form-text text-muted">
                {intl.formatMessage(messages['profile.name.details'])}
              </small>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
              <p data-hj-suppress className="h5">{name}</p>
            </>
          ),
        }}
      />
    );
  }
}

Name.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  name: PropTypes.string,
  visibilityName: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

Name.defaultProps = {
  editMode: 'static',
  saveState: null,
  name: null,
  visibilityName: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Name));
