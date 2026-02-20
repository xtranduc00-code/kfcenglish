import {
  ScreenSharePresets,
  VideoPresets,
  type RoomOptions,
  type ScreenShareCaptureOptions,
} from "livekit-client";

// --- Camera -----------------------------------------------------------------

export const MEETS_CAMERA_CAPTURE = {
  resolution: VideoPresets.h1080.resolution,
} as const;

export const MEETS_CAMERA_MAX_BITRATE = 12_000_000;

// --- Screen share capture ----------------------------------------------------

export const MEETS_SCREEN_SHARE_CAPTURE: ScreenShareCaptureOptions = {
  resolution: ScreenSharePresets.original.resolution,
  contentHint: "detail",
  audio: true,
  systemAudio: "include",
  suppressLocalAudioPlayback: true,
};

// --- Room / publish ----------------------------------------------------------

const MEETS_SCREEN_SHARE_ENCODING = {
  maxBitrate: 35_000_000,
  maxFramerate: 15,
} as const;

export const MEETS_LIVEKIT_ROOM_OPTIONS = {
  adaptiveStream: true,
  dynacast: true,

  videoCaptureDefaults: {
    resolution: MEETS_CAMERA_CAPTURE.resolution,
  },

  publishDefaults: {
    /**
     * Với VP9 + scalabilityMode, đang đi theo hướng SVC.
     * Khi đó không nên kỳ vọng các simulcast layers hoạt động như VP8 simulcast.
     */
    simulcast: true,
    videoCodec: "vp9",
    backupCodec: true,
    scalabilityMode: "L3T3_KEY",

    videoEncoding: {
      ...VideoPresets.h1080.encoding,
      maxBitrate: MEETS_CAMERA_MAX_BITRATE,
    },

    /**
     * Screen share: ưu tiên bitrate cao + giữ detail.
     */
    screenShareEncoding: {
      ...MEETS_SCREEN_SHARE_ENCODING,
    },

    degradationPreference: "maintain-resolution",
  },
} satisfies RoomOptions;
