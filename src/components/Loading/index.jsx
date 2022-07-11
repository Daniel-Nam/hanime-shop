import Styles from './index.module.css'

export default function Loading() {
	return (
		<div className={Styles.Loader}>
			<div className={Styles.LoaderInner}>
				<div className={Styles.LoaderLineWrap}>
					<div className={Styles.LoaderLine}></div>
				</div>
				<div className={Styles.LoaderLineWrap}>
					<div className={Styles.LoaderLine}></div>
				</div>
				<div className={Styles.LoaderLineWrap}>
					<div className={Styles.LoaderLine}></div>
				</div>
				<div className={Styles.LoaderLineWrap}>
					<div className={Styles.LoaderLine}></div>
				</div>
				<div className={Styles.LoaderLineWrap}>
					<div className={Styles.LoaderLine}></div>
				</div>
			</div>
		</div>
	)
}
