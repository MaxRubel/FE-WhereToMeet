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
export type UserType = (UserDB & FirebaseUser) | null | "notLoggedIn";

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
  votingOpen: boolean;

  description: string;
  location: Location;
  time: string; // datetime string

  suggestions: Suggestion[];
  messages: Message[];
};

//------ sub-types------
export type Location = {
  name: string;
  url: string;
  address: {
    street: string;
    zipcode: number;
    coordinates: {
      lat: number;
      long: number;
    };
  };
};

export type Suggestion = {
  _id?: string;
  userId: string; //mongo user._id
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
  votes: string[];
};

export type Message = {
  _id: string; //primary key
  uid: string;
  name: string;
  email: string;
  message: string;
  created: string; // datetime string
  updated: string | null; // datetime string
};

export type vote = {
  count: number;
  uid: string;
};
