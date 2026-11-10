export default function ProjectArt({ project }: { project: string }) {
  const key = project.toLowerCase()
  if (key === "carenest") return (
    <div className="project-art carenest-art" aria-hidden="true">
      <svg className="cn-chart" viewBox="0 0 400 250" fill="none">
        <path d="M0 150h400" stroke="currentColor" strokeWidth=".4" strokeDasharray="3 5" />
        <path d="M0 176C40 172 70 168 104 170s58 6 90-14 52-40 88-34 74 18 118 12" stroke="currentColor" strokeWidth="1.1" />
        <path d="M0 196h400M0 216h400M0 136h400M0 116h400" stroke="currentColor" strokeWidth=".25" />
        <circle cx="282" cy="122" r="4" fill="currentColor" />
        <path d="M282 122v-40" stroke="currentColor" strokeWidth=".6" strokeDasharray="2 3" />
      </svg>
      <span className="art-title">Care<span className="italic">Nest</span><span className="cn-mark">◦</span></span>
    </div>
  )
  if (key === "datumguard") return (
    <div className="project-art datum-art" aria-hidden="true">
      <svg className="dg-frame" viewBox="0 0 400 250" fill="none">
        <circle cx="200" cy="125" r="96" stroke="currentColor" strokeWidth=".5" />
        <circle cx="200" cy="125" r="58" stroke="currentColor" strokeWidth=".5" />
        <path d="M200 12v226M87 125h226" stroke="currentColor" strokeWidth=".5" />
        <path d="M200 30l9 16h-18z" fill="currentColor" fillOpacity=".5" />
        <circle cx="200" cy="125" r="3" fill="currentColor" />
      </svg>
      <span className="art-title">Datum<span className="italic">Guard</span></span>
    </div>
  )
  return key === "healthbot" ? (
    <div className="project-art health-art" aria-hidden="true">
      <svg className="health-orbit" viewBox="0 0 400 250" fill="none">
        <ellipse
          cx="200"
          cy="125"
          rx="114"
          ry="76"
          stroke="currentColor"
          strokeWidth=".5"
        />
        <ellipse
          cx="200"
          cy="125"
          rx="114"
          ry="76"
          transform="rotate(55 200 125)"
          stroke="currentColor"
          strokeWidth=".5"
        />
        <ellipse
          cx="200"
          cy="125"
          rx="114"
          ry="76"
          transform="rotate(-55 200 125)"
          stroke="currentColor"
          strokeWidth=".5"
        />
        <path
          d="M0 125h132l12-15 15 35 20-62 21 84 19-49 10 7h171"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle cx="200" cy="125" r="4" fill="currentColor" />
      </svg>
      <span className="art-title">
        Health<span className="italic">Bot</span>
        <span className="health-plus">✳</span>
      </span>
    </div>
  ) : (
    <div className="project-art placd-art" aria-hidden="true">
      <svg className="room" viewBox="0 0 400 260" fill="none">
        <path
          d="M0 225 136 156H400M136 0v156M0 20l136 40H400M136 60v96M0 260l136-82 264 68"
          stroke="#897f6e"
          strokeWidth=".6"
        />
        <path
          d="M172 78h57v61h-57zM178 84h45v49h-45z"
          stroke="#928775"
          strokeWidth=".7"
        />
        <path
          d="M42 94 100 76v80l-58 29Z"
          fill="#d0c2a2"
          fillOpacity=".15"
          stroke="#c5b594"
          strokeWidth=".5"
        />
        <path d="M71 85v85M43 140l56-19" stroke="#c5b594" strokeWidth=".5" />
        <path d="m185 174 84-1 47 29-87 4z" fill="#615e52" />
        <path d="m179 151 80-2 17 25-90 4Z" fill="#8b8675" />
        <path
          d="m179 151 7 27v22l-13-8v-30ZM186 178l90-4v22l-90 4Z"
          fill="#777463"
        />
        <path
          d="m234 204 61-3 18 13-63 5zM251 219v14M307 214v13"
          stroke="#b0a18b"
        />
        <path d="M327 175v-57M311 118h33l-6-23h-20z" stroke="#ad9c7e" />
        <path d="m325 175-9 4h22z" stroke="#ad9c7e" />
        <path
          d="M151 164v-32m0 20c-20-5-17-18-17-18 16 0 17 18 17 18Zm0-8c17-3 18-15 18-15-14-1-18 15-18 15Z"
          stroke="#8c9479"
        />
        <path d="M142 161h18l-3 16h-12z" fill="#817b68" />
      </svg>
      <span className="art-title placd-title">
        placd<span className="italic">ai</span>
        <span className="tiny-star">✧</span>
      </span>
    </div>
  )
}
