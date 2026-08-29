import { Button } from 'react-bootstrap'
import Style from './UploadPage.module.scss'
import { smortApi as smort } from '../../Api/smortApi'
import React, { createRef, ReactElement, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from '../../translations/TranslationProvider'
import { Img } from '../../core/ImprovedControls/Img'
import { Video } from '../../core/ImprovedControls/Video'

export const UploadPage = (): ReactElement => {
	const { t } = useTranslation();

	const [ContentFile, setContentFile] = React.useState<File | null>(null)
	const [Title, setTitle] = React.useState<string>("")
	let Description = "";
	const InputFile = createRef<HTMLInputElement>();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null; // Get the file or null
		if (file) {
			setContentFile(file)
		}
	}

	const GetContentType = (): string => {
		if (ContentFile === null) {
			return "Nan";
		}

		if (ContentFile.type.includes("image")) {
			return "Image"
		}
		if (ContentFile.type.includes("video")) {
			return "Video"
		}
		return "Nan"
	}

	const ShowVideo = (): ReactElement => (<Video autoPlay className={Style.PreviewImage} src={ContentFile ? URL.createObjectURL(ContentFile) : ''} />);
	const ShowImage = (): ReactElement => (<Img className={Style.PreviewImage} src={ContentFile ? URL.createObjectURL(ContentFile) : ''} />);

	return (
		<div className={Style.Page}>
			<div className={Style.UploadOptions}>
				<label>{t('uploadContent.placeholderDescription')}</label><br />
				<textarea
					placeholder={t('uploadContent.placeholderDescription')}
					className={Style.InputFields}
					onChange={(event) => Description = event.target.value} /><br />

				<input
					hidden
					accept="image/*,video/*"
					className="form-control"
					type="file"
					ref={InputFile}
					onChange={(event) => {
						handleFileUpload(event)

					}} />
				<Button className={GetContentType() !== "Nan" ? Style.UploadContentFilled : Style.UploadContentEmpty}
					onClick={() => {
						InputFile.current?.click()
					}}>
					{ContentFile ?
						<>{GetContentType() !== "Nan" ?
							<> {GetContentType() === "Video" ? <ShowVideo /> : <ShowImage />}
							</> : <>{t('uploadContent.errorSelect')}</>}</> :
						<>{t('uploadContent.prompt')}</>}

				</Button>

				<div className={Style.Actions}>
					<Button variant="secondary">
						{t('uploadContent.close')}
					</Button>
					<Button variant="primary"
						disabled={GetContentType() === "Nan"}
						onClick={() => {
							if (GetContentType() === "Video") {
								smort.UploadVideo(ContentFile, Title, Description).then(worked => {
									if (worked === true) {
										window.location.reload();
									}
								});
							} else {
								smort.UploadPostImage(ContentFile, Title, Description).then(worked => {
									if (worked === true) {
										Navigate({ to: "/Home" })
									}
								});
							}
						}}>
						upload {GetContentType()}
					</Button>
				</div>
			</div>
		</div>
	)
}
