import { Schema, model, models } from 'mongoose';

const FeedSchema = new Schema(
  {
    channelId: { type: String, required: true },
    serverId: { type: String, required: true },
    name: { type: String, required: true },
    link: { type: String, required: true },
    createdBy: { type: String, required: true },
    activated: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type FeedType = {
  channelId: string;
  serverId: string;
  name: string;
  link: string;
  createdBy: string;
  activated: boolean;
  deleted: boolean;
};

export default models.LinkSchema || model('Feed', FeedSchema);
