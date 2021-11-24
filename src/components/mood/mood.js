import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import axios from 'axios'

import './mood.scss'

export const Mood = () => {
  const [mood, setMood] = useState([])
  const [notes, setNotes] = useState('')
  const [score, setScore] = useState(null)
  const scores = [1, 2, 3, 4, 5]

  // maybe for week view display a button that opens a modal with scores and notes for the week
  // need to think of a way to view past notes by date

  useEffect(() => {
    axios({
      url: 'http://localhost:3000/mood/1',
      method: 'GET',
      headers: { 'Content-Type': undefined },
    })
      .then(res => {
        if (
          new Date(res.data[0].created_at).toDateString ===
          new Date(Date.now()).toDateString
        ) {
          setMood([res.data])
          setScore(res.data[0].score)
          setNotes(res.data[0].notes)
        }
      })
      .catch(console.error)
  }, [score, notes])

  const addScore = e => {
    const data = {
      notes: notes,
      score: e.target.id,
      user_id: 1,
    }

    if (mood !== []) {
      const today = new Date(Date.now()).toDateString
      const filteredMoods = mood[0].filter(
        moods => new Date(moods.created_at).toDateString === today
      )

      if (filteredMoods !== []) {
        axios({
          url: `http://localhost:3000/mood/1/${mood[0][0].id}`,
          method: 'DELETE',
          headers: { 'Content-Type': undefined },
        })
      }
    }

    axios({
      url: `http://localhost:3000/mood`,
      method: 'POST',
      headers: { 'Content-Type': undefined },
      data: data,
    }).then(res => setScore(res.data.score))
  }

  const submitNote = e => {
    const data = {
      notes: e.target.value,
      score: score,
      user_id: 1,
      id: mood[0][0].id,
    }

    axios({
      url: `http://localhost:3000/mood/1/${mood[0][0].id}`,
      method: 'PUT',
      headers: { 'Content-Type': undefined },
      data: data,
    }).then(res => setNotes(res.data.notes))
  }

  const notesClassName = classNames('mood__notes', {
    'has-note': notes !== '',
  })

  return (
    <div className="mood">
      <div className="mood__title">How's Your Mood?</div>
      <div className="mood__scores">
        {scores.map(num => (
          <button
            className={score === num ? 'mood__score-active' : 'mood__score'}
            id={num}
            onClick={addScore}
          >
            {num}
          </button>
        ))}
      </div>
      <form className="mood__notes">
        <textarea
          className={notesClassName}
          id={score}
          placeholder={'Thoughts for the day...?'}
          defaultValue={notes}
          onChange={submitNote}
        />

        {/* <button type="submit" className="mode__notes-submit" onClick={submitNote} disabled={score === null}>Save Note</button> */}
      </form>
    </div>
  )
}