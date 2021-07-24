import { Schema, model, Document, Model } from 'mongoose';

export interface Feed {
  _id?: string;
  channelId: string;
  serverId: string;
  name: string;
  link: string;
  createdBy: string;
  activated: boolean;
  deleted: boolean;
  latestChecksum: string;
}

export type FeedDocument = Feed & Document;

const FeedSchema = new Schema<FeedDocument, Model<FeedDocument>>(
  {
    channelId: { type: String, required: true },
    serverId: { type: String, required: true },
    name: { type: String, required: true },
    link: { type: String, required: true },
    createdBy: { type: String, required: true },
    activated: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    latestChecksum: { type: String, default: '' },
  },
  { timestamps: true },
);

export const FeedModel = model<FeedDocument, Model<FeedDocument>>(
  'Feed',
  FeedSchema,
);
