import { useSpeakers } from "@/hooks/useSpeakers";
import { Speaker } from "../../models/speaker";

export default function SpeakersList() {
  const { speakers, loading } = useSpeakers();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Empresa</th>
            <th>Palestra</th>
            <th>Avaliável</th>
          </tr>
        </thead>
        <tbody>
          {speakers.map((speaker: Speaker) => (
            <tr key={speaker.id}>
              <td>{speaker.name}</td>
              <td>{speaker.company}</td>
              <td>{speaker.topic}</td>
              <td>{speaker.canBeEvaluated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
