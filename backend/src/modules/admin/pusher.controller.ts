import type { Response } from "express";
import { pusher } from "../../config/pusher";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const pusherAuth = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    if (!pusher) throw new ApiError(500, "Pusher not configured");

    const socketId = req.body?.socket_id;
    const channelName = req.body?.channel_name;

    if (!socketId || !channelName)
      throw new ApiError(400, "Missing socket_id/channel_name");
    if (channelName !== "private-admin")
      throw new ApiError(403, "Forbidden channel");

    const authResponse = pusher.authorizeChannel(socketId, channelName);
    res.json(authResponse);
  }
);
