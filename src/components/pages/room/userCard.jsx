import React from "react";

import MovableCard from "../../shared/movableCard";

const UserCard = (props) => {
  return (
    <MovableCard uid={props.user_id}>
      <span>{props.userName}</span>
    </MovableCard>
  );
};

export default UserCard;
