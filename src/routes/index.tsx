import {createBrowserRouter} from 'react-router-dom';

import React from 'react';

import Activate from 'routes/Activate';
import LoginPage from 'routes/auth';
import OrgMemberReportPage from 'routes/OrgMemberReport';
import ProjectCreate from 'routes/ProjectCreate';
import ProjectReport from 'routes/ProjectReport';
import ProjectsPage from 'routes/Projects';
import ProjectItem from 'routes/Projects/Item';
import RestPage from 'routes/Rest';

import ClientsPage from './Clients';
import ClientsCreate from './Clients/Create';
import ClientsEdit from './Clients/Edit';
import ExportPage from './Export';
import HolidaysPage from './Holidays';
import MonitoringPage from './Monitoring';
import MemberSheet from './Monitoring/MemberSheet';
import MyProfilePage from './MyProfile';
import OrganizationPage from './Organization';
import OrganizationBitrixPage from './Organization/Bitrix';
import OrganizationCreatePage from './Organization/Create';
import OrganizationTrackerPage from './Organization/Tracker';
import OrgMembersPage from './OrgMembers';
import OrgMembersCreate from './OrgMembers/Create';
import OrgMembersEdit from './OrgMembers/Edit';
import ResetPasswordPage from './PasswordReset';
import Root from './Root';
import SummaryPage from './Summary';
import TagsPage from './Tags';
import TimePage from './Time';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <TimePage />,
      },
      {
        path: 'time',
        element: <TimePage />,
      },
      {
        path: 'monitoring/sheet/:id/plain',
        element: <MemberSheet />,
      },
      {
        path: 'monitoring',
        element: <MonitoringPage />,
      },
      {
        path: 'org_member_report',
        element: <OrgMemberReportPage />,
      },
      {
        path: 'organization',
        children: [
          {
            index: true,
            element: <OrganizationPage />,
          },
          {
            path: 'bitrix',
            element: <OrganizationBitrixPage />,
          },
          {
            path: 'tracker',
            element: <OrganizationTrackerPage />,
          },
          {
            path: 'create',
            element: <OrganizationCreatePage />,
          },
        ],
      },
      {
        path: 'export',
        element: <ExportPage />,
      },

      {
        path: 'organizationmember',
        children: [
          {
            index: true,
            element: <OrgMembersPage />,
          },
          {
            path: 'edit/:id',
            element: <OrgMembersEdit />,
          },
          {
            path: 'create',
            element: <OrgMembersCreate />,
          },
        ],
      },

      {
        path: 'client',
        children: [
          {
            index: true,
            element: <ClientsPage />,
          },
          {
            path: 'edit/:id',
            element: <ClientsEdit />,
          },
          {
            path: 'create',
            element: <ClientsCreate />,
          },
        ],
      },
      {
        path: 'summary',
        element: <SummaryPage />,
      },

      {
        path: 'rest',
        element: <RestPage />,
      },
      {
        path: 'holidays',
        element: <HolidaysPage />,
      },
      {
        path: 'tags',
        element: <TagsPage />,
      },
      {
        path: 'report_project',
        element: <ProjectReport />,
      },
      {
        path: 'me',
        element: <MyProfilePage />,
      },
      {
        path: 'project',
        children: [
          {
            index: true,
            element: <ProjectsPage />,
          },
          {
            path: ':id',
            element: <ProjectItem />,
          },
          {
            path: 'create',
            element: <ProjectCreate />,
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <LoginPage />,
  },
  {
    path: '/password_reset',
    element: <ResetPasswordPage />,
  },
  {
    path: '/me/activate',
    element: <Activate />,
  },
]);

export default router;
