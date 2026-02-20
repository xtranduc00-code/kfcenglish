"use client";

import {
  isTrackReference,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-core";
import { RemoteTrackPublication, Track, VideoQuality } from "livekit-client";
import { useEffect } from "react";

export type MeetsVideoSubscriptionProfile = "main" | "thumbnail";

/**
 * Remote video: chọn quality/layer theo loại tile.
 * - main: ưu tiên HIGH
 * - thumbnail: ưu tiên LOW để tiết kiệm băng thông
 *
 * Lưu ý:
 * - setVideoQuality chỉ có tác dụng rõ khi track được publish với simulcast/SVC
 * - setVideoDimensions là hint thêm cho server về kích thước render
 */
export function useMeetsTrackSubscriptionProfile(
  trackRef: TrackReferenceOrPlaceholder,
  profile: MeetsVideoSubscriptionProfile,
): void {
  const publication = isTrackReference(trackRef)
    ? trackRef.publication
    : undefined;

  const remotePub =
    publication instanceof RemoteTrackPublication ? publication : undefined;

  const subscriptionReady = Boolean(remotePub?.isSubscribed && remotePub.track);

  useEffect(() => {
    if (!isTrackReference(trackRef) || trackRef.participant.isLocal) {
      return;
    }

    const pub = trackRef.publication;
    if (
      !pub ||
      pub.kind !== Track.Kind.Video ||
      !(pub instanceof RemoteTrackPublication)
    ) {
      return;
    }

    if (!pub.isSubscribed || !pub.track) {
      return;
    }

    const isScreen = trackRef.source === Track.Source.ScreenShare;

    if (profile === "main") {
      pub.setVideoQuality(VideoQuality.HIGH);

      pub.setVideoDimensions(
        isScreen ? { width: 1920, height: 1080 } : { width: 1280, height: 720 },
      );

      if (isScreen) {
        pub.setVideoFPS(15);
      }
    } else {
      pub.setVideoQuality(VideoQuality.LOW);

      pub.setVideoDimensions(
        isScreen ? { width: 640, height: 360 } : { width: 320, height: 180 },
      );

      pub.setVideoFPS(8);
    }
  }, [
    profile,
    trackRef.participant.identity,
    trackRef.source,
    publication?.trackSid,
    subscriptionReady,
  ]);
}
