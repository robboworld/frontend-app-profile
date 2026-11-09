/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { getLocale } from '@edx/frontend-platform/i18n';

import { createWidgetLoader, preloadWidget } from './widgetPreload';

// «Что нового» button: one widget for every header, served by the LMS (robbo_changelog); it fetches
// the user's changes on the LMS session and hides itself for guests. For learners it reports
// {inMenu, unread, label, open} through onChange instead: RobboHeader shows a profile menu item.
const WIDGET_PATH = '/api/robbo/v1/whats-new/widget.js';

export const loadWhatsNewWidget = createWidgetLoader(WIDGET_PATH, 'RobboWhatsNew');

preloadWidget(loadWhatsNewWidget);

const RobboWhatsNew = ({ className, profileToggleRef, onChange }) => {
  const containerRef = React.useRef(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    const lmsBaseUrl = getConfig().LMS_BASE_URL;
    let widget = null;
    let unsubscribe = null;
    let cancelled = false;
    if (!lmsBaseUrl) {
      return undefined;
    }
    loadWhatsNewWidget(lmsBaseUrl)
      .then((api) => {
        if (!cancelled && containerRef.current) {
          widget = api.mount(containerRef.current, {
            lmsUrl: lmsBaseUrl,
            lang: getLocale(),
            variant: 'on-dark',
            // Learners: no button here — «Что нового» is a profile menu item, the panel hangs from the menu button.
            profileToggle: profileToggleRef ? () => profileToggleRef.current : undefined,
          });
          if (widget && widget.subscribe) {
            unsubscribe = widget.subscribe((info) => {
              if (onChangeRef.current) {
                onChangeRef.current({ ...info, open: widget.open });
              }
            });
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
      if (widget) {
        widget.unmount();
      }
    };
  }, [profileToggleRef]);

  return <span ref={containerRef} className={className} />;
};

RobboWhatsNew.propTypes = {
  className: PropTypes.string,
  profileToggleRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onChange: PropTypes.func,
};

RobboWhatsNew.defaultProps = {
  className: undefined,
  profileToggleRef: undefined,
  onChange: undefined,
};

export default RobboWhatsNew;
