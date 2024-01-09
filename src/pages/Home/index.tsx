import { HandPalm, Play } from "phosphor-react";
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState } from "react";


import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { createContext } from "react";


interface Cycle{
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  InterruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
   activeCycle: Cycle | undefined
   amountSecondsPassed: number
   activeCycleId: string | null
   markCurrentCycleAsFinished: () => void
   setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext ({} as CyclesContextType)

const newCycleFormsValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount:zod
  .number()
  .min(5,'O ciclo precisa ser de no minimo 5 minutos.')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})


type NewCycleFormData = zod.infer<typeof newCycleFormsValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed ] = useState(0)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormsValidationSchema),
    defaultValues:{
      task:'',
      minutesAmount: 0,

    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
 
  function setSecondsPassed(seconds: number){
     setAmountSecondsPassed(seconds)
  }
  
function markCurrentCycleAsFinished(){
  setCycles((state ) => state.map((cycle) => {
    if (cycle.id === activeCycleId) {
     return {...cycle, finishedDate: new Date() }
    } else {
     return cycle
    }
 }),
)
}

 function handleCreateNewCycle(data: NewCycleFormData){
  const id = String(new Date().getTime());
   const newCycle : Cycle = {
     id, 
     task: data.task,
     minutesAmount: data.minutesAmount,
     startDate: new Date(),
   }

   setCycles((state) => [...state, newCycle])
   setActiveCycleId(id)
   setAmountSecondsPassed(0)
  
  
   reset();
 }


 function handleInterruptCycle(){
  setCycles((state) => state.map((cycle) => {
     if (cycle.id === activeCycleId) {
      return {...cycle, InterruptedDate: new Date() }
     } else {
      return cycle
     }
  }),
  )
  setActiveCycleId(null)
 }

 const task = watch('task')
 const isSubmitDisabled = !task


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
      <CyclesContext.Provider
        value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed,}}>
        <FormProvider {...newCycleForm}>
        <NewCycleForm /> 
        </FormProvider>
        <Countdown />
        </CyclesContext.Provider> 
       
        { activeCycle ? (
         <StopCountdownButton  onClick={handleInterruptCycle} type="button">
         <HandPalm size={24} />
         Interromper
       </StopCountdownButton>
        ):(
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}

export default Home;
