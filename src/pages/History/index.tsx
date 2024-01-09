import { useContext } from "react";
import { formatDistanceToNow} from 'date-fns'
import { ptBR } from "date-fns/locale";
import { HistoryContainer } from "./styles";
import { HistoryList } from "./styles";
import { Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";

function History (){
 const {cycles} = useContext(CyclesContext)
 
  return (
  
   <HistoryContainer>
    <h1>Meu histórico</h1>
    
    <HistoryList>
       <table>
        <thead>
          <tr>
            <th>Tarefa</th> 
            <th>Duração</th>
            <th>Início</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
           {cycles.map(cycle => {
            return (
              <tr key={cycle.id}>
            <td>{cycle.task}</td>
            <td>{cycle.minutesAmount} minutos</td>
            <td>{formatDistanceToNow(cycle.startDate, {
                addSuffix: true,
                locale: ptBR,
            })}
            </td>
            <td>
              { cycle.finishedDate && (
              <Status statusColor="green">Concluído</Status>
              )}

              { cycle.InterruptedDate && (
              <Status statusColor="red">Interrompido</Status>
              )}

               { !cycle.finishedDate && !cycle.InterruptedDate && (
              <Status statusColor="yellow">Em andamento</Status>
              )}
            </td>
           </tr>
            )
           })}
        </tbody>
       </table>
    </HistoryList>
   </HistoryContainer>
  )
}
export default History;
