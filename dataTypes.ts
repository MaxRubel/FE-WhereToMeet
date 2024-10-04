// -----main types-----
export type user = {
  userId: string; //primary key
  name: string;
  phone: number;
  email: string;
  address: {
    name: string;
    zipcode: number;
    state: string;
    private: boolean;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  friends: string[];
};

export type group = {
  groupId: string; //primary key
  ownerId: string; //foreign key
  name: string;
  description: string;
  members: string[]; //array of userIds
};

export type event = {
  eventId: string; //primary key
  ownerId: string; //foreign key
  groupId: string; //foreign key

  description: string;
  location: location;
  time: string; // datetime string

  suggestions: location[];
  messages: message[];
};

//------ sub-types------
export type location = {
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
  votes: vote[];
};

export type message = {
  messageId: string;
  userId: user;
  name: string;
  email: string;
  message: string;
  created: string; // datetime string
  updated: string | null; // datetime string
};

export type vote = {
  count: number;
  userId: string;
};
