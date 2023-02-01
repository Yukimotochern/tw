import React from 'react';
import { Form, Input, Button, Divider, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../trpc/client';
import { useTranslation } from 'react-i18next';

export const MainLoginPage = () => {
  const { t } = useTranslation('auth', { keyPrefix: 'main_login' });
  const { t: t1 } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-12 mt-8 md:mt-0">
        <Typography.Title level={1} className="whitespace-pre-wrap">
          {t('title')}
        </Typography.Title>
      </div>
      <div className="mr-0 md:mr-8">
        <Button
          className="mb-4"
          size="large"
          type="default"
          block
          onClick={() => trpc.user.get.query()}
        >
          <img
            className="mr-2 inline-block h-3/4 -translate-y-[0.1rem]"
            src="/google_logo.png"
            alt="Google Logo"
          />
          {t('google_oauth_button')}
        </Button>
        <Divider plain>{t1('or')}</Divider>
        <Form layout="vertical" requiredMark={false} size="large">
          <Form.Item
            name="email"
            label={
              <Typography.Title style={{ margin: 0 }} level={5}>
                {t('email_label')}
              </Typography.Title>
            }
          >
            <Input placeholder={t('input_email')} />
          </Form.Item>
          <Form.Item
            name="password"
            label={
              <Typography.Title style={{ margin: 0 }} level={5}>
                {t('password_label')}
              </Typography.Title>
            }
          >
            <Input.Password placeholder={t('input_password')} />
          </Form.Item>
          <Button
            size="small"
            type="link"
            htmlType="button"
            onClick={() => navigate('/sign_up')}
          >
            <span className="underline underline-offset-1">{t('sign_up')}</span>
          </Button>
          <span className="-mx-[0.4rem]">{t1('comma')}</span>
          <Button
            size="small"
            type="link"
            htmlType="button"
            onClick={() => navigate('/staff_login')}
          >
            <span className="underline underline-offset-1">
              {t('staff_login')}
            </span>
          </Button>
          <span className="-mx-[0.2rem]">{t1('or')}</span>
          <Button
            size="small"
            type="link"
            htmlType="button"
            onClick={() => navigate('/forget_password')}
          >
            <span className="underline underline-offset-1">
              {t('forget_password?')}
            </span>
          </Button>
        </Form>
      </div>
    </>
  );
};
