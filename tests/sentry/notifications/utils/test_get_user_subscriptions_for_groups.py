from unittest import TestCase

from sentry.models import Group, GroupSubscription, Project, User
from sentry.notifications.helpers import get_user_subscriptions_for_groups
from sentry.notifications.types import NotificationScopeType, NotificationSettingOptionValues
from sentry.types.integrations import ExternalProviders


class GetUserSubscriptionsForGroupsTestCase(TestCase):
    def setUp(self) -> None:
        self.user = User(1)
        self.project = Project(id=123)
        self.group = Group(id=456, project=self.project)
        self.group_subscription = GroupSubscription(is_active=True)

    def test_get_user_subscriptions_for_groups_empty(self):
        groups_by_project = {self.project: {self.group}}
        notification_settings_by_scope = {
            NotificationScopeType.USER: {
                self.user.id: {
                    ExternalProviders.SLACK: NotificationSettingOptionValues.NEVER,
                    ExternalProviders.EMAIL: NotificationSettingOptionValues.ALWAYS,
                },
            },
            NotificationScopeType.PROJECT: {
                self.project.id: {
                    ExternalProviders.SLACK: NotificationSettingOptionValues.NEVER,
                    ExternalProviders.EMAIL: NotificationSettingOptionValues.NEVER,
                },
            },
        }

        subscriptions_by_group_id = {self.group.id: self.group_subscription}
        assert (
            get_user_subscriptions_for_groups(
                groups_by_project={},
                notification_settings_by_scope={},
                subscriptions_by_group_id={},
                user=self.user,
            )
            == {}
        )

        assert (
            get_user_subscriptions_for_groups(
                groups_by_project={},
                notification_settings_by_scope=notification_settings_by_scope,
                subscriptions_by_group_id=subscriptions_by_group_id,
                user=self.user,
            )
            == {}
        )

        assert (
            get_user_subscriptions_for_groups(
                groups_by_project=groups_by_project,
                notification_settings_by_scope={},
                subscriptions_by_group_id=subscriptions_by_group_id,
                user=self.user,
            )
            == {self.group.id: (False, True, self.group_subscription)}
        )

        assert (
            get_user_subscriptions_for_groups(
                groups_by_project=groups_by_project,
                notification_settings_by_scope=notification_settings_by_scope,
                subscriptions_by_group_id={},
                user=self.user,
            )
            == {self.group.id: (True, False, None)}
        )

    def test_get_user_subscriptions_for_groups(self):
        groups_by_project = {self.project: {self.group}}
        notification_settings_by_scope = {
            NotificationScopeType.USER: {
                self.user.id: {
                    ExternalProviders.SLACK: NotificationSettingOptionValues.NEVER,
                    ExternalProviders.EMAIL: NotificationSettingOptionValues.ALWAYS,
                },
            },
            NotificationScopeType.PROJECT: {
                self.project.id: {
                    ExternalProviders.SLACK: NotificationSettingOptionValues.NEVER,
                    ExternalProviders.EMAIL: NotificationSettingOptionValues.NEVER,
                },
            },
        }
        subscriptions_by_group_id = {self.group.id: self.group_subscription}
        assert (
            get_user_subscriptions_for_groups(
                groups_by_project,
                notification_settings_by_scope,
                subscriptions_by_group_id,
                user=self.user,
            )
            == {self.group.id: (False, True, self.group_subscription)}
        )
