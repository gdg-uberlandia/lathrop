import { Speaker } from "models/speaker";
import React from "react";

interface SpeakerCardProps {
  speaker: Speaker;
}

const SpeakerCard = ({ speaker }: SpeakerCardProps) => {
  return (
    <div>
      {speaker.id}
    </div>
  );
};
export default SpeakerCard;
