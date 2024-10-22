import { User as FirebaseUser } from "firebase/auth";

// -----main types-----

// this is what sends/gets from the database
export type UserDB = {
  _id: string; //primary key from mongo
  uid: string; //primary key from google
  name: string;
  avatarUrl: string;
  phone: string;
  email: string;
  address: {
    street: string;
    zip: number;
    city: string;
    state: string;
    private: boolean;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  friends: string[];
};

// -- init user --
// -- this is an empty user object for initialising forms
export const emptyUserDB = {
  _id: "",
  uid: "",
  name: "",
  phone: "",
  email: "",
  avatarUrl: "",
  address: {
    street: "",
    zip: 0,
    city: "",
    state: "",
    private: false,
    coordinates: {
      lat: 0,
      long: 0,
    },
  },
  friends: [],
};

//this is the full user type stored in auth context
export type UserType =
  | null // for loading page
  | "notLoggedIn" // for not logged in
  | (UserDB & FirebaseUser) // for logged in
  | { _id: string }; //for guest

export type Group = {
  _id?: string; //primary key
  ownerId: string; //foreign key
  name: string;
  description: string;
  members: UserDB[]; //array of _ids
  dateCreated?: string;
};

export type Event = {
  _id: string; //primary key
  name: string;
  ownerId: string; //foreign key
  groupId: string; //foreign key
  private: boolean; //if event is viewable by anyone or just group members
  suggestionsEnabled: boolean;
  chatEnabled: boolean;
  description: string;
  location: Location;
  startDate: Date | null;
  startTime: string;
  endDate: Date | null;
  endTime: string;
  suggestions: Suggestion[];
  messages: Message[];
};

//------ sub-types------
export type Location = {
  name: string;
  url: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: number;
    coordinates: {
      lat: number;
      long: number;
    };
  };
};

export type Suggestion = {
  _id?: string; // primary key
  userId: string; //mongo user._id creator of the suggestion
  eventId: string; //foreign key for event
  name: string;
  description: string;
  url: string;
  address: {
    street: string;
    city: string;
    zipcode: number;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  votes: string[]; //user_ids
};

export type Message = {
  id?: string | null; //primary key
  userId: string;
  message: string;
  user?: UserDB;
  eventId: string;
  created: Date;
  updated: Date | null; // datetime string
};

export type vote = {
  count: number;
  uid: string;
};
