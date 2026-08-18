import { useOutletContext } from 'react-router-dom';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useDevice from '@/hooks/useDevice';
import { ClubDetail } from '@/types/club';
import { useFeedItems } from './hooks/useFeedItems';
import PhotoEditTabDesktop from './PhotoEditTabDesktop';
import PhotoEditTabMobile from './PhotoEditTabMobile';

const PhotoEditTab = () => {
  const { isMobile, isTablet } = useDevice();
  useTrackPageView(PAGE_VIEW.PHOTO_EDIT_PAGE);
  const clubDetail = useOutletContext<ClubDetail>();

  const {
    feedItems,
    feedItemsRef,
    setFeedItems,
    isLoading,
    pendingChanges,
    addFiles,
    deleteImage,
    clearAll,
    retryItem,
    save,
  } = useFeedItems(clubDetail?.id, clubDetail?.feeds || []);

  if (isMobile || isTablet) {
    return (
      <PhotoEditTabMobile
        feedItems={feedItems}
        feedItemsRef={feedItemsRef}
        setFeedItems={setFeedItems}
        isLoading={isLoading}
        pendingChanges={pendingChanges}
        addFiles={addFiles}
        deleteImage={deleteImage}
        retryItem={retryItem}
        save={save}
      />
    );
  }

  return (
    <PhotoEditTabDesktop
      feedItems={feedItems}
      feedItemsRef={feedItemsRef}
      setFeedItems={setFeedItems}
      isLoading={isLoading}
      pendingChanges={pendingChanges}
      addFiles={addFiles}
      deleteImage={deleteImage}
      clearAll={clearAll}
      retryItem={retryItem}
      save={save}
    />
  );
};

export default PhotoEditTab;
