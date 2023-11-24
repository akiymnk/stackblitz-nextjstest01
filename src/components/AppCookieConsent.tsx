import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import React from 'react';
import CookieConsent from 'react-cookie-consent';

export const AppCookieConsent = () => {
  const appInsights = useAppInsightsContext();
  return (
    <CookieConsent
      location="bottom"
      buttonText="同意する"
      declineButtonText="拒否する"
      enableDeclineButton={true}
      buttonClasses="btn btn-primary mx-2 mb-1"
      declineButtonClasses="btn btn-danger mx-2 mb-1"
      disableButtonStyles={true}
      cookieSecurity={true}
      sameSite="Strict"
      cookieName="__Host-CookieConsent"
      onAccept={() => {
        appInsights.getCookieMgr().setEnabled(true);
      }}
      onDecline={() => {
        appInsights.getCookieMgr().setEnabled(false);
      }}
    >
      当ウェブサイトは利便性向上を目的にクッキーを使用しております。使用に同意いただける場合は「同意する」ボタンを押してください。
    </CookieConsent>
  );
};
