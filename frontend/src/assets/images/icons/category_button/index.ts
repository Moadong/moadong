import iconAllActive from '@/assets/images/icons/category_button/category_all_button_icon_active.svg';
import iconAll from '@/assets/images/icons/category_button/category_all_button_icon.svg';
import iconHobbyActive from '@/assets/images/icons/category_button/category_hobby_button_icon_active.svg';
import iconHobby from '@/assets/images/icons/category_button/category_hobby_button_icon.svg';
import iconPerformanceActive from '@/assets/images/icons/category_button/category_performance_button_icon_active.svg';
import iconPerformance from '@/assets/images/icons/category_button/category_performance_button_icon.svg';
import iconReligionActive from '@/assets/images/icons/category_button/category_religion_button_icon_active.svg';
import iconReligion from '@/assets/images/icons/category_button/category_religion_button_icon.svg';
import iconSportActive from '@/assets/images/icons/category_button/category_sport_button_icon_active.svg';
import iconSport from '@/assets/images/icons/category_button/category_sport_button_icon.svg';
import iconStudyActive from '@/assets/images/icons/category_button/category_study_button_icon_active.svg';
import iconStudy from '@/assets/images/icons/category_button/category_study_button_icon.svg';
import iconVolunteerActive from '@/assets/images/icons/category_button/category_volunteer_button_icon_active.svg';
import iconVolunteer from '@/assets/images/icons/category_button/category_volunteer_button_icon.svg';

export const inactiveCategoryIcons: Record<string, string> = {
  all: iconAll,
  volunteer: iconVolunteer,
  religion: iconReligion,
  hobby: iconHobby,
  study: iconStudy,
  sport: iconSport,
  performance: iconPerformance,
};

export const activeCategoryIcons: Record<string, string> = {
  all: iconAllActive,
  volunteer: iconVolunteerActive,
  religion: iconReligionActive,
  hobby: iconHobbyActive,
  study: iconStudyActive,
  sport: iconSportActive,
  performance: iconPerformanceActive,
};
