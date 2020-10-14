import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  delete ret.password;
}

export const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'name cannot be empty'],
    },

    summoner: {
      type: String,
      unique: [true, 'summoner already exists'],
      require: [true, 'summoner cannot be empty'],
    },

    email: {
      type: String,
      required: [true, 'Email can not be empty'],
      unique: [true, 'email already exists'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password can not be empty'],
      minlength: [6, 'Password should include at least 6 chars'],
    },

    annotations: [
      {
        type: Object,
      },
    ],
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  },
);
