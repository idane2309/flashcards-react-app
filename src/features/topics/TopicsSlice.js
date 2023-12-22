import {createSlice} from '@reduxjs/toolkit'
import { addQuiz } from '../quizzes/QuizzesSlice'

const topicSlice = createSlice({
    name: 'topics',
    initialState: {
        topics: {}
    },
    reducers: {
        addTopic: (state, action) => {
            const {id, name, icon} = action.payload
            state.topics[id] = {
                id,
                name,
                icon,
                quizIds: []
            }
        }
    },
    extraReducers: {
        [addQuiz]: (state, action) => {
            const { id, topicId } = action.payload
            state.topics[topicId].quizIds.push(id)
        }
    }
})

export const { addTopic } = topicSlice.actions
export default topicSlice.reducer

/*Selectors*/
export const selectTopics = state => state.topics.topics