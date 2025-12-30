import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { da_DK, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import da from '@angular/common/locales/da';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  UserAddOutline,
  PlayCircleOutline,
  ClockCircleOutline,
  RiseOutline,
  RobotOutline,
  LinkOutline,
  SettingOutline,
  CheckCircleOutline,
  MailOutline,
  ApiOutline,
  SafetyOutline,
  FundOutline,
  DashboardOutline,
  MessageOutline,
  MenuOutline,
  ArrowRightOutline,
  RocketOutline,
  LinkedinFill,
  DatabaseOutline,
  ApiTwoTone,
  SettingTwoTone,
  RocketTwoTone,
  CheckCircleTwoTone,
  FileTextTwoTone,
  EditTwoTone,
  DashboardTwoTone,
  PauseCircleTwoTone,
  FundTwoTone,
  ClockCircleTwoTone,
  MailTwoTone,
  BulbTwoTone,
  SafetyCertificateTwoTone,
  InteractionTwoTone,
  DollarTwoTone,
  HeartTwoTone,
  ThunderboltTwoTone,
  UpOutline,
  DownOutline,
  EyeTwoTone,
  ToolTwoTone
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

registerLocaleData(da);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNzI18n(da_DK),
    provideNzIcons([
      UserAddOutline,
      PlayCircleOutline,
      ClockCircleOutline,
      RiseOutline,
      RobotOutline,
      LinkOutline,
      SettingOutline,
      CheckCircleOutline,
      MailOutline,
      ApiOutline,
      SafetyOutline,
      FundOutline,
      DashboardOutline,
      MessageOutline,
      ArrowRightOutline,
      MenuOutline,
      RocketOutline,
      LinkedinFill,
      DatabaseOutline,
      ApiTwoTone,
      SettingTwoTone,
      RocketTwoTone,
      CheckCircleTwoTone,
      FileTextTwoTone,
      EditTwoTone,
      DashboardTwoTone,
      PauseCircleTwoTone,
      FundTwoTone,
      ClockCircleTwoTone,
      MailTwoTone,
      BulbTwoTone,
      SafetyCertificateTwoTone,
      InteractionTwoTone,
      DollarTwoTone,
      HeartTwoTone,
      ThunderboltTwoTone,
      UpOutline,
      DownOutline,
      EyeTwoTone,
      ToolTwoTone
    ]), provideClientHydration(withEventReplay())
  ]
};
