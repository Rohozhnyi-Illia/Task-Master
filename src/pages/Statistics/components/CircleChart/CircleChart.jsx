import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CircleChart = ({ data }) => {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    setReady(true)
  }, [])

  const COLORS = ['#FF4C4C', '#FFA500', '#4C9AFF']

  const CustomLegend = ({ payload }) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
        fontSize: '0.9rem',
      }}
    >
      {payload.map((entry, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: entry.color,
              borderRadius: '2px',
            }}
          />
          <span style={{ color: 'var(--text-color)' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )

  return ready ? (
    <div style={{ width: '100%', maxWidth: 380, position: 'relative', paddingBottom: '100%' }}>
      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={({ x, y, value }) => (
              <text
                x={x}
                y={y}
                fill="var(--text-color)"
                fontSize={14}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {value}
              </text>
            )}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  ) : null
}

export default CircleChart
