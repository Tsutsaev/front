import {Link, useNavigate, useParams} from 'react-router-dom';

import {bindActionCreators, Dispatch} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getAllClients} from 'store/clients/actions';
import {getProjMemberByProject} from 'store/projectMembers/actions';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {cloneProject, deleteProject, getProjectsById} from 'store/projects/actions';
import {selectProjects} from 'store/projects/selectors';
import {IProjectState} from 'store/projects/types';
import {selectCurrentOrgId} from 'store/user/selectors';
import {reduceName} from 'utils';

import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import EditProjectInfo from 'components/Project/Edit/Info';
import EditMembersProjects from 'components/Project/Edit/Members';
import StatusChecker from 'components/StatusChecker';

import UseAppDispatch from 'hooks/UseAppDispatch';
import UseRoleRedirect from 'hooks/UseRoleRedirect';

import styles from './index.module.css';
import {Props} from './types';

const ProjectItem = ({
  currentOrgId,
  getAllClients,
  getProjectsById,
  getProjMemberByProject,
  projects,
}: Props) => {
  UseRoleRedirect();
  const {id} = useParams();
  const {projects: ProjectsData, status} = projects;
  const navigate = useNavigate();
  const dispatch = UseAppDispatch();
  const projectData = ProjectsData.find(proj => proj.id === Number(id));

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getAllClients({orgId: currentOrgId});
    getProjectsById({orgId: currentOrgId, id});
    getProjMemberByProject({orgId: currentOrgId, projectId: id});
  }, [id, currentOrgId, getProjectsById, getAllClients, getProjMemberByProject]);

  const onDelete = async () => {
    setShowModal(false);
    if (projectData) await dispatch(deleteProject({orgId: currentOrgId, id: projectData.id}));
    navigate('/project');
  };

  const onClone = async () => {
    if (id) {
      const newProjectId = (
        (await dispatch(cloneProject({orgId: currentOrgId, id}))).payload as IProjectState
      ).id;

      navigate(`/project/${newProjectId}`);
    }
  };

  if (!projectData) return null;

  return (
    <PageWrapper>
      <StatusChecker statusArray={[status]}>
        <PageMenu title={reduceName(projectData.name)}>
          <div className={styles.buttons}>
            <Button onClick={onClone} type={'submit'}>
              Клонировать
            </Button>
            <Link to={'/project'}>
              <Button type={'submit'}>Назад</Button>
            </Link>
          </div>
        </PageMenu>
        <EditProjectInfo project={projectData} />
        <EditMembersProjects />
        <div className={styles.delete}>
          <Button onClick={() => setShowModal(true)} type={'reset'}>
            Удалить проект
          </Button>
        </div>

        {showModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setShowModal(false)}
            title="проект"
          />
        )}
      </StatusChecker>
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  projects: selectProjects(state),
  projectMembers: selectProjectMembers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllClients,
      getProjectsById,
      getProjMemberByProject,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProjectItem);
