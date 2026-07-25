// 경력 상세 팝업 본문(메타·섹션·링크)을 렌더하는 컴포넌트
import { type MouseEvent } from 'react';
import { LineFitText } from '@components/composed/text/LineFitText';
import { SvgIcon } from '@components/design/icon/Icon';
import { TypedExternalLink } from '@components/composed/link/TypedExternalLink';
import { typedExternalLinkStyles as linkStyles } from '@components/composed/link/TypedExternalLink';
import { renderRichText, renderLinkTitle } from '@sections/projects/utils/richText';
import { getLinkTypeLabel } from '@sections/projects/utils/linkLabels';
import { formatExperienceDateFull } from '@utils/dateFormat';
import { buildCls } from '@utils/cssUtil';
import ExperienceModel, { type ExperienceLink } from '../../../models/experience';
import cardStyles from '@components/composed/card/projectCard.module.css';

interface ExperienceDetailContentProps {
  experience: ExperienceModel;
}

export function ExperienceDetailContent({ experience }: ExperienceDetailContentProps) {
  const sections = experience.sections ?? [];
  const topLinks = experience.links ?? [];
  const imageUrl = experience.getImageUrl();

  const handleOpenExternal = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const backDividerCls = buildCls(cardStyles.backDivider, topLinks.length === 0 && cardStyles.backDividerTight);

  return (
    <>
      <div className={cardStyles.modalHead}>
        <div className={cardStyles.modalCompanyWrap}>
          {imageUrl && (
            <span className={cardStyles.modalBrandIcon}>
              <span className={cardStyles.modalBrandIconInner}>
                <SvgIcon src={imageUrl} />
              </span>
            </span>
          )}
          <span className={cardStyles.modalTitle}>{experience.company}</span>
        </div>
        <div className={cardStyles.modalCompany}>{experience.position}</div>
        {topLinks.length > 0 && (
          <div className={cardStyles.backMetaBlock}>
            <div className={cardStyles.links}>
              {topLinks.map((link: ExperienceLink, idx: number) => (
                <TypedExternalLink
                  key={idx}
                  href={link?.href}
                  typeLabel={getLinkTypeLabel(link?.type)}
                  title={renderLinkTitle(link?.title, linkStyles.sep)}
                  onClick={link?.href ? handleOpenExternal(link.href) : undefined}
                />
              ))}
            </div>
          </div>
        )}
        <div className={cardStyles.periodRight}>
          {formatExperienceDateFull(experience.startDate)} ~ {formatExperienceDateFull(experience.endDate)}
        </div>
      </div>
      <hr className={backDividerCls} />
      <div className={cardStyles.modalBody}>
        <div className={cardStyles.sections}>
          {sections.map((section) => (
            <article key={section.title} className={cardStyles.section}>
              <h5>
                <LineFitText text={section.title ?? ''} lineCount={2} />
              </h5>
              <ul>
                {(section.items || []).map((item, idx) => (
                  <li key={`${section.title}-${idx}`}>
                    {typeof item === 'string' ? (
                      <LineFitText text={item} lineCount={0} renderLine={renderRichText} />
                    ) : (
                      item
                    )}
                  </li>
                ))}
              </ul>
              {(section.links || []).length > 0 && (
                <div className={cardStyles.sectionLinks}>
                  {(section.links || []).map((link: ExperienceLink, idx: number) => (
                    <TypedExternalLink
                      key={idx}
                      href={link?.href}
                      typeLabel={getLinkTypeLabel(link?.type)}
                      title={renderLinkTitle(link?.title, linkStyles.sep)}
                      onClick={link?.href ? handleOpenExternal(link.href) : undefined}
                    />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
