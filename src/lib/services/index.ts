// Export all API services
export { AuthService } from './auth.service';
export { AppsService } from './apps.service';
export { SettingsService } from './settings.service';
export { ReviewsService } from './reviews.service';
export { NotificationsService } from './notifications.service';
export { WalletService } from './wallet.service';

// Import classes for instantiation
import { AppsService } from './apps.service';
import { SettingsService } from './settings.service';
import { ReviewsService } from './reviews.service';
import { NotificationsService } from './notifications.service';
import { WalletService } from './wallet.service';

// Export service instances for easy use
// Note: AuthService uses static methods, so no instance is needed
export const appsService = new AppsService();
export const settingsService = new SettingsService();
export const reviewsService = new ReviewsService();
export const notificationsService = new NotificationsService();
export const walletService = new WalletService();
